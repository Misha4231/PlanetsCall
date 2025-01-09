using System.Drawing.Imaging;
using Core;
using Data.Context;
using Data.DTO.Community;
using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.Community;

public class OrganisationsRepository : IOrganisationsRepository
{
    private readonly PlatensCallContext _context;
    private readonly IConfiguration _configuration;
    private readonly FileService _fileService;
    
    public OrganisationsRepository(PlatensCallContext context, IConfiguration configuration, FileService fileService)
    {
        this._context = context;
        this._configuration = configuration;
        _fileService = fileService;
    }
    public PaginatedList<MinOrganisationDto> GetUserOrganisations(Users user, int page)
    {
        int pageSize = _configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();
        
        List<MinOrganisationDto> organisations = _context.Organizations
            .Include(o => o.Members)
            .Where(u => u.Members.Any(m => m.Id == user.Id))
            .Select(o => new MinOrganisationDto(o))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        Users fullUser = _context.Users
            .Include(u => u.MyOrganisation)
            .First(u => u.Id == user.Id);
        var count = fullUser.MyOrganisation.Count;
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<MinOrganisationDto>(organisations, page, totalPages);
    }
    public void JoinOrganization(Users user, string organisationUniqueName)
    {
        Organisations? organisation = _context.Organizations
            .Include(o => o.Members)
            .Include(o => o.Requests)
            .FirstOrDefault(o => o.UniqueName == organisationUniqueName);
        
        if (organisation is null)
        {
            throw new Exception("Organisation does not exist");
        }
        if (organisation.MinimumJoinLevel > user.Progress)
        {
            throw new Exception("User does not have enough level.");
        }
        if (organisation.Members.Count >= 50)
        {
            throw new Exception("Organisation can't have more than 50 members");
        }
        if (organisation.Members.Contains(user))
        {
            throw new Exception("User is already a member");
        }
        if (organisation.Requests.Contains(user) && organisation.IsPrivate)
        {
            throw new Exception("User has sent request previously");
        }

        Users fullUser = _context.Users
            .Include(u => u.MyOrganisation)
            .Include(u => u.RequestedOrganizations)
            .First(u => u.Id == user.Id);

        if (!organisation.IsPrivate)
        {
            organisation.Members.Add(fullUser);
            fullUser.MyOrganisation.Add(organisation);
        }
        else
        {
            organisation.Requests.Add(fullUser);
            fullUser.RequestedOrganizations.Add(organisation);
        }
        
        _context.Organizations.Update(organisation);
        _context.Users.Update(fullUser);
        _context.SaveChanges();
    }
    public FullOrganisationDto CreateOrganisation(Users user, OrganisationFormDto organisationData)
    {
        Organisations? existiongOrg =
            _context.Organizations.FirstOrDefault(o => o.UniqueName == organisationData.UniqueName);
        if (existiongOrg is not null) throw new Exception("Unique name is taken");

        string logoPath = "";
        if (!string.IsNullOrEmpty(organisationData.OrganizationLogo))
        {
            logoPath = _fileService.SaveFile(organisationData.OrganizationLogo, "organisations",
                new ImageFormat[] { ImageFormat.Jpeg, ImageFormat.Png }, 4);
        }

        EntityEntry<Organisations> newOrganisation = _context.Organizations.Add(new Organisations()
        {
            Name = organisationData.Name,
            UniqueName = organisationData.UniqueName,
            Description = organisationData.Description,
            IsVerified = false,
            OrganizationLogo = logoPath,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now,
            InstagramLink = organisationData.InstagramLink,
            LinkedinLink = organisationData.LinkedinLink,
            YoutubeLink = organisationData.YoutubeLink,
            IsPrivate = organisationData.IsPrivate,
            MinimumJoinLevel = organisationData.MinimumJoinLevel,
            CreatorId = user.Id,
            Creator = user,
            Members = new List<Users>() {user}
        });

        _context.SaveChanges();

        return new FullOrganisationDto(newOrganisation.Entity);
    }
    public List<MinUserDto> GetRequests(Users user, string organisationUniqueName)
    {
        EnsureUserHasPermission(user, organisationUniqueName, role => role.CanAcceptUsers);
        Organisations organisation = _context.Organizations
            .Include(o => o.Requests)
            .FirstOrDefault(o => o.UniqueName == organisationUniqueName)!;
        
        return organisation.Requests.Select(u => new MinUserDto(u)).ToList();
    }
    public void AcceptRequest(Users user, string organisationUniqueName, int requestUserId)
    {
        EnsureUserHasPermission(user, organisationUniqueName, role => role.CanAcceptUsers);
        Organisations organisation = _context.Organizations
            .Include(o => o.Requests)
            .Include(o => o.Members)
            .FirstOrDefault(o => o.UniqueName == organisationUniqueName)!;
        Users? newMember = _context.Users
            .Include(u => u.MyOrganisation)
            .Include(u => u.RequestedOrganizations)
            .FirstOrDefault(u => u.Id == requestUserId);
        if (newMember is null)
        {
            throw new Exception("User with given id does not exist");
        }
        if (organisation.Members.Count >= 100)
        {
            throw new Exception("Organisation can't have more than 100 members");
        }
        
        organisation.Members.Add(newMember);
        newMember.MyOrganisation.Add(organisation);
        organisation.Requests.Remove(newMember);
        newMember.RequestedOrganizations.Remove(organisation);

        _context.SaveChanges();
    }
    public void RejectRequest(Users user, string organisationUniqueName, int requestUserId)
    {
        EnsureUserHasPermission(user, organisationUniqueName, role => role.CanAcceptUsers);
        Organisations organisation = _context.Organizations
            .Include(o => o.Requests)
            .FirstOrDefault(o => o.UniqueName == organisationUniqueName)!;
        Users? rejectedMember = _context.Users
            .Include(u => u.MyOrganisation)
            .Include(u => u.RequestedOrganizations)
            .FirstOrDefault(u => u.Id == requestUserId);
        if (rejectedMember is null)
        {
            throw new Exception("User with given id does not exist");
        }

        organisation.Requests.Remove(rejectedMember);
        rejectedMember.RequestedOrganizations.Remove(organisation);

        _context.SaveChanges();
    }
    public List<MinUserDto> GetMembers(string organizationUniqueName)
    {
        Organisations? organisation = _context.Organizations
            .Include(o => o.Members)
            .FirstOrDefault(o => o.UniqueName == organizationUniqueName);
        
        if (organisation is null)
        {
            throw new Exception("Organisation does not exist");
        }

        return organisation.Members.Select(u => new MinUserDto(u)).ToList();
    }
    public void RemoveMember(Users user, string organisationUniqueName, int removeUserId)
    {
        if (user.Id != removeUserId)
        {
            EnsureUserHasPermission(user, organisationUniqueName, role => role.CanRemoveUsers);
        }
        
        Organisations organisation = _context.Organizations
            .Include(o => o.Members)
            .FirstOrDefault(o => o.UniqueName == organisationUniqueName)!;
        Users? member = _context.Users
            .Include(u => u.MyOrganisation)
            .Include(u => u.OrganizationRoles)
            .FirstOrDefault(u => u.Id == removeUserId);
        if (member is null)
        {
            throw new Exception("User with given id does not exist");
        }

        organisation.Members.Remove(member);
        member.MyOrganisation.Remove(organisation);
        
        OrganisationRoles? role = member.OrganizationRoles.FirstOrDefault(o => o.Organisation == organisation);
        if (role is not null)
        {
            member.OrganizationRoles.Remove(role);
        }
        
        _context.SaveChanges();
    }
    public PaginatedList<MinOrganisationDto> SearchOrganization(string searchString, int page)
    {
        int pageSize = _configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();

        var foundOrganisations = _context.Organizations
            .Where(o => o.UniqueName.Contains(searchString) || o.Name.Contains(searchString))
            .Select(o => new MinOrganisationDto(o));
            
        List<MinOrganisationDto> pageOrganisations = foundOrganisations
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var count = foundOrganisations.Count();
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<MinOrganisationDto>(pageOrganisations, page, totalPages);
    }
    public FullOrganisationDto GetOrganisation(string organisationUniqueName)
    {
        FullOrganisationDto? org = _context.Organizations
            .Where(o => o.UniqueName == organisationUniqueName)
            .Include(o => o.Requests)
            .Include(o => o.Creator)
            .Include(o => o.Members)
            .Include(o => o.Roles)
            //.Include(o => o.)
            .Select(o => new FullOrganisationDto(o))
            .FirstOrDefault();
        if (org is null) throw new Exception("Organisation does not exist");

        return org;
    }

    public Organisations? GetObjOrganisation(string organisationUniqueName)
    {
        return _context.Organizations
            .Include(o => o.Members)
            .Include(o => o.Roles)
            .FirstOrDefault(o => o.UniqueName == organisationUniqueName);
    }

    public FullOrganisationDto UpdateOrganisation(OrganisationUpdateFormDto organisation, Users user)
    {
        Organisations? organisationToUpdate = _context.Organizations.FirstOrDefault(o => o.Id == organisation.Id);
        if (organisationToUpdate is null) throw new Exception("Organisation not exist");
        
        EnsureUserHasPermission(user, organisationToUpdate.UniqueName, role => role.CanConfigureOrganization);

        Organisations? org = _context.Organizations.FirstOrDefault(o => o.UniqueName == organisation.UniqueName);
        if (org is not null && org.Id != organisationToUpdate.Id)
        {
            throw new Exception("Organisation UniqueName is taken");
        }
        string? logoPath = organisation.OrganizationLogo;
        if (logoPath != organisationToUpdate.OrganizationLogo)
        {
            if (!string.IsNullOrEmpty(organisationToUpdate.OrganizationLogo))
            {
                _fileService.DeleteFile(organisationToUpdate.OrganizationLogo);
            }

            if (!string.IsNullOrEmpty(logoPath))
            {
                logoPath = _fileService.SaveFile(logoPath, "organisations", new ImageFormat[] { ImageFormat.Jpeg, ImageFormat.Png }, 4);
            }
        }

        organisationToUpdate.Name = organisation.Name;
        organisationToUpdate.UniqueName = organisation.UniqueName;
        organisationToUpdate.Description = organisation.Description;
        organisationToUpdate.OrganizationLogo = logoPath;
        organisationToUpdate.UpdatedAt = DateTime.Now;
        organisationToUpdate.InstagramLink = organisation.InstagramLink;
        organisationToUpdate.LinkedinLink = organisation.LinkedinLink;
        organisationToUpdate.YoutubeLink = organisation.YoutubeLink;
        organisationToUpdate.IsPrivate = organisation.IsPrivate;
        organisationToUpdate.MinimumJoinLevel = organisation.MinimumJoinLevel;

        _context.SaveChanges();

        return new FullOrganisationDto(organisationToUpdate);
    }
    public void RemoveOrganisation(string organisationUniqueName, Users user)
    {
        Organisations? organisation = _context.Organizations.FirstOrDefault(o => o.UniqueName == organisationUniqueName);
        if (organisation is null) throw new Exception("Organisation not exist");
        
        EnsureUserHasPermission(user, organisationUniqueName, role => role.CanDeleteOrganization);
        
        if (!string.IsNullOrEmpty(organisation.OrganizationLogo))
        {
            _fileService.DeleteFile(organisation.OrganizationLogo);
        }

        _context.Organizations.Remove(organisation);
        _context.SaveChanges();
    }
    public void EnsureUserHasPermission(Users user, string organisationUniqueName, Func<OrganisationRoles, bool> permissionCheck)
    {
        FullOrganisationDto organisation = GetOrganisation(organisationUniqueName);
        if (organisation.Roles == null || !organisation.Roles.Any())
        {
            throw new Exception("No roles associated with the organisation.");
        }

        OrganisationRoles? userRole = organisation.Roles.FirstOrDefault(role => role.UsersWithRole?.Any(u => u.Id == user.Id) == true);


        if ((userRole is null || !permissionCheck(userRole)) && organisation.CreatorId != user.Id)
        {
            throw new Exception("Access denied");
        }
    }

    public FullRoleDto CreateRole(Organisations organisation, RolesFormDto role)
    {
        string? image = role.Image;
        if (!string.IsNullOrEmpty(image))
        {
            image = _fileService.SaveFile(image, "organisations",
                new ImageFormat[] { ImageFormat.Jpeg, ImageFormat.Png }, 4);
        }
        EntityEntry<OrganisationRoles> newRole = _context.OrganizationRoles.Add(new OrganisationRoles()
        {
            Title = role.Title,
            CanDeleteOrganization = role.CanDeleteOrganization,
            CanRemoveUsers = role.CanRemoveUsers,
            CanAcceptUsers = role.CanAcceptUsers,
            CanConfigureOrganization = role.CanConfigureOrganization,
            CanAddTask = role.CanAddTask,
            CanConfigureRoles = role.CanConfigureRoles,
            CanGivePermissions = role.CanGivePermissions,
            CanUpdateTasks = role.CanUpdateTasks,
            CanDeleteTasks = role.CanDeleteTasks,
            Image = image,
            OrganisationId = organisation.Id,
            UsersWithRole = new List<Users>()
        });

        _context.SaveChanges();
        return new FullRoleDto(newRole.Entity);
    }

    public FullRoleDto UpdateRole(Organisations organisation, RolesFormDto role, int roleId)
    {
        OrganisationRoles? roleToUpdate = _context.OrganizationRoles.FirstOrDefault(r => r.Id == roleId);
        if (roleToUpdate is null) throw new Exception("role is not exist");
        
        string? logoPath = roleToUpdate.Image;
        if (logoPath != role.Image)
        {
            if (!string.IsNullOrEmpty(roleToUpdate.Image))
            {
                _fileService.DeleteFile(roleToUpdate.Image);
            }

            if (!string.IsNullOrEmpty(logoPath))
            {
                logoPath = _fileService.SaveFile(logoPath, "organisations", new ImageFormat[] { ImageFormat.Jpeg, ImageFormat.Png }, 4);
            }
        }

        roleToUpdate.Image = logoPath;
        roleToUpdate.Title = role.Title;
        roleToUpdate.CanDeleteOrganization = role.CanDeleteOrganization;
        roleToUpdate.CanRemoveUsers = role.CanRemoveUsers;
        roleToUpdate.CanAcceptUsers = role.CanAcceptUsers;
        roleToUpdate.CanConfigureOrganization = role.CanConfigureOrganization;
        roleToUpdate.CanAddTask = role.CanAddTask;
        roleToUpdate.CanConfigureRoles = role.CanConfigureRoles;
        roleToUpdate.CanGivePermissions = role.CanGivePermissions;
        roleToUpdate.CanUpdateTasks = role.CanUpdateTasks;
        roleToUpdate.CanDeleteTasks = role.CanDeleteTasks;
        _context.SaveChanges();

        return new FullRoleDto(roleToUpdate);
    }

    public void DeleteRole(int roleId)
    {
        OrganisationRoles? roleToUpdate = _context.OrganizationRoles.FirstOrDefault(r => r.Id == roleId);
        if (roleToUpdate is null) throw new Exception("role is not exist");

        _context.OrganizationRoles.Remove(roleToUpdate);
        _context.SaveChanges();
    }

    public void GrantRole(Organisations organisation, Users user, int roleId)
    {
        OrganisationRoles? roleToUpdate = _context.OrganizationRoles
            .Include(o => o.UsersWithRole)
            .FirstOrDefault(r => r.Id == roleId);
        if (roleToUpdate is null) throw new Exception("role is not exist");
        
        roleToUpdate.UsersWithRole.Add(user);
        _context.SaveChanges();
    }

    public void RevokeRole(Organisations organisation, Users user, int roleId)
    {
        OrganisationRoles? roleToUpdate = _context.OrganizationRoles
            .Include(o => o.UsersWithRole)
            .FirstOrDefault(r => r.Id == roleId);
        if (roleToUpdate is null) throw new Exception("role is not exist");
        if (!roleToUpdate.UsersWithRole.Contains(user)) throw new Exception("user doesn't have that role");
        
        roleToUpdate.UsersWithRole.Remove(user);
        _context.SaveChanges();
    }
}