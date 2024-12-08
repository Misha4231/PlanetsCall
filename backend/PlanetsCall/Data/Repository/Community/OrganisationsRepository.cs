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
    public PaginatedList<Organisations> GetUserOrganisations(Users user, int page)
    {
        int pageSize = _configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();
        
        var organisations = _context.Organizations
            .Include(o => o.Members)
            .Where(u => u.Members.Contains(user))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        Users fullUser = _context.Users
            .Include(u => u.MyOrganisation)
            .First(u => u.Id == user.Id);
        var count = fullUser.MyOrganisation.Count;
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<Organisations>(organisations, page, totalPages);
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
    public Organisations CreateOrganisation(Users user, MinOrganisationDto organisationData)
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

        return newOrganisation.Entity;
    }

    public List<MinUserDto> GetRequests(Users user, string organisationUniqueName)
    {
        Organisations? organisation = HaveAccessToRequests(user, organisationUniqueName);
        return organisation.Requests.Select(u => new MinUserDto(u)).ToList();
    }

    public void AcceptRequest(Users user, string organisationUniqueName, int requestUserId)
    {
        Organisations? organisation = HaveAccessToRequests(user, organisationUniqueName);
        Users? newMember = _context.Users
            .Include(u => u.MyOrganisation)
            .Include(u => u.RequestedOrganizations)
            .FirstOrDefault(u => u.Id == requestUserId);
        if (newMember is null)
        {
            throw new Exception("User with given id does not exist");
        }
        if (organisation.Members.Count >= 50)
        {
            throw new Exception("Organisation can't have more than 50 members");
        }
        
        organisation.Members.Add(newMember);
        newMember.MyOrganisation.Add(organisation);
        organisation.Requests.Remove(newMember);
        newMember.RequestedOrganizations.Remove(organisation);

        _context.SaveChanges();
    }

    public void RejectRequest(Users user, string organisationUniqueName, int requestUserId)
    {
        Organisations? organisation = HaveAccessToRequests(user, organisationUniqueName);
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
        Organisations? organisation;
        if (user.Id != removeUserId)
        {
            organisation = HaveAccessToRequests(user, organisationUniqueName);
        }
        else
        {
            organisation = _context.Organizations
                .Include(o => o.Members)
                .FirstOrDefault(o => o.UniqueName == organisationUniqueName);
        }
        
        Users? member = _context.Users
            .Include(u => u.MyOrganisation)
            .Include(u => u.OrganizationRoles)
            .FirstOrDefault(u => u.Id == removeUserId);
        if (member is null)
        {
            throw new Exception("User with given id does not exist");
        }

        if (organisation is not null)
        {
            organisation.Members.Remove(member);
            member.MyOrganisation.Remove(organisation);
            OrganisationRoles? role = member.OrganizationRoles.FirstOrDefault(o => o.Organisation == organisation);
            
            if (role is not null)
            {
                member.OrganizationRoles.Remove(role);
            }
        }
        _context.SaveChanges();
    }

    public PaginatedList<Organisations> SearchOrganization(string searchString, int page)
    {
        int pageSize = _configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();

        var foundOrganisations = _context.Organizations
            .Where(o => o.UniqueName.Contains(searchString) || o.Name.Contains(searchString));
            
        var pageOrganisations = foundOrganisations
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var count = foundOrganisations.Count();
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<Organisations>(pageOrganisations, page, totalPages);
    }

    public Organisations GetOrganisation(string organisationUniqueName)
    {
        Organisations? org = _context.Organizations.FirstOrDefault(o => o.UniqueName == organisationUniqueName);
        if (org is null) throw new Exception("Organisation does not exist");

        return org;
    }

    public Organisations UpdateOrganisation(Organisations organisation)
    {
        throw new NotImplementedException();
    }

    public void RemoveOrganisation(string organisationUniqueName)
    {
        throw new NotImplementedException();
    }

    public Organisations HaveAccessToRequests(Users user, string organisationUniqueName)
    {
        Organisations? organisation = _context.Organizations
            .Include(o => o.Requests)
            .Include(o => o.Creator)
            .Include(o => o.Members)
            .FirstOrDefault(o => o.UniqueName == organisationUniqueName);
        
        if (organisation is null)
        {
            throw new Exception("Organisation does not exist");
        }

        Users fullUser = _context.Users
            .Include(u => u.OrganizationRoles)
            .First(u => u.Id == user.Id);

        var userRoles = fullUser.OrganizationRoles ?? new List<OrganisationRoles>();
        OrganisationRoles? userRole = userRoles.FirstOrDefault(r => r.Organisation.Id == organisation.Id);

        if ((userRole is null || !userRole.CanAcceptUsers) && (organisation.Creator is null || organisation.Creator.Id != fullUser.Id))
        {
            throw new Exception("Access denied");
        }

        return organisation;
    }
}