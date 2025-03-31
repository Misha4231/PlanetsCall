using Core;
using Core.Exceptions;
using Data.Context;
using Data.DTO.Community;
using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;
using SixLabors.ImageSharp.Formats;

namespace Data.Repository.Community;

public class OrganisationsRepository(PlatensCallContext context, IConfiguration configuration, FileService fileService)
    : RepositoryBase(context, configuration), IOrganisationsRepository
{
    public PaginatedList<MinOrganisationDto> GetUserOrganisations(Users user, int page) // Retrieves a paginated list of organizations that the specified user is a member of.
    {
        int pageSize = Configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>(); // Retrieve the page size from configuration settings.
        
        // Query to filter and project user's organizations.
        var organisationsQuery = Context.Organizations
            .Include(o => o.Members)
            .Where(u => u.Members!.Any(m => m.Id == user.Id))
            .Select(o => new MinOrganisationDto(o));
            
        // Fetch the paginated list of organizations for the requested page.
        List<MinOrganisationDto> organisations = organisationsQuery.Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        // Fetch the total count of organizations for pagination calculations.
        var count = organisations.Count();
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<MinOrganisationDto>(organisations, page, totalPages);
    }
    public void JoinOrganization(Users? user, string organisationUniqueName) // Adds the user to the specified organization, or adds them to the request list if the organization is private.
    {
        Organisations? organisation = GetObjOrganisation(organisationUniqueName); // Fetch the organisation by its unique name.

        Users? fullUser = Context.Users     // Load the full user entity, including their relationships with organizations.
            .Include(u => u.MyOrganisation)
            .Include(u => u.RequestedOrganizations)
            .First(u => user != null && u.Id == user.Id);

        // If the organization is public, add the user to the members list.
        if (!organisation.IsPrivate)
        {
            if (organisation.Members != null) organisation.Members.Add(fullUser);
            if (fullUser.MyOrganisation != null) fullUser.MyOrganisation.Add(organisation);
        }
        else // If the organization is private, add the user to the request list.
        {
            if (organisation.Requests != null) organisation.Requests.Add(fullUser);
            if (fullUser.RequestedOrganizations != null) fullUser.RequestedOrganizations.Add(organisation);
        }
        
        // Update the database with the modified entities.
        Context.Organizations.Update(organisation);
        Context.Users.Update(fullUser);
        Context.SaveChanges();
    }

    public bool IsMember(Users user, int organisationId) // check if user is a member of organization
    {
        var org = Context.Organizations
            .Include(o => o.Members)
            .Include(o => o.Creator)
            .FirstOrDefault(o => o.Id == organisationId);
        
        if (org == null) return false;
        // either creator or member
        return user.Id == org.Creator.Id || org.Members.Any(u => u.Id == user.Id);
    }

    public FullOrganisationDto CreateOrganisation(Users user, OrganisationFormDto organisationData) // Creates a new organization and saves it to the database.
    {
        // Check if an organization with the same unique name already exists.
        Organisations? existiongOrg =
            Context.Organizations.FirstOrDefault(o => o.UniqueName == organisationData.UniqueName);
        if (existiongOrg is not null) throw new CodeException("Unique name is taken", StatusCodes.Status400BadRequest);

        // Initialize the organization's logo path. Save the logo file if provided.
        string logoPath = "";
        if (!string.IsNullOrEmpty(organisationData.OrganizationLogo))
        {
            logoPath = fileService.SaveFile(organisationData.OrganizationLogo, "organisations",
                new List<string> { "png", "jpg", "jpeg", "gif" }, 4);
        }

        // Create a new organization entity and populate its properties from the DTO and user details.
        EntityEntry<Organisations> newOrganisation = Context.Organizations.Add(new Organisations()
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
        
        // Save the new organization to the database.
        Context.SaveChanges();

        return new FullOrganisationDto(newOrganisation.Entity);
    }
    public List<MinUserDto> GetRequests(Users user, string organisationUniqueName) // Retrieves the list of users who have requested to join a specified organization.
    {
        // Ensure the user has the necessary permissions to view join requests for the organization.
        EnsureUserHasPermission(user, organisationUniqueName, role => role.CanAcceptUsers);
        
        // Fetch the organization, including its join requests.
        Organisations organisation = Context.Organizations
            .Include(o => o.Requests)
            .FirstOrDefault(o => o.UniqueName == organisationUniqueName)!;

        if (organisation.Requests != null) return organisation.Requests.Select(u => new MinUserDto(u)).ToList();
        return [];
    }
    public void AcceptRequest(Users user, string organisationUniqueName, int requestUserId) // Accepts a user's join request for a specific organization.
    {
        // Ensure the user has the necessary permission to accept join requests for the organization.
        EnsureUserHasPermission(user, organisationUniqueName, role => role.CanAcceptUsers);
        
        // Retrieve the organization details by its unique name.
        Organisations organisation = GetObjOrganisation(organisationUniqueName);
        
        // Find the user who made the join request, including their related collections.
        Users? newMember = Context.Users
            .Include(u => u.MyOrganisation)
            .Include(u => u.RequestedOrganizations)
            .FirstOrDefault(u => u.Id == requestUserId);
        
        if (newMember is null)
        {
            throw new CodeException("User with given id does not exist", StatusCodes.Status404NotFound);
        }
        if (organisation.Members != null && organisation.Members.Count >= 100) // Check if the organization has reached its maximum member capacity.
        {
            throw new CodeException("Organisation can't have more than 100 members", StatusCodes.Status400BadRequest);
        }
        
        // Add to members
        if (organisation.Members != null) organisation.Members.Add(newMember);
        if (newMember.MyOrganisation != null) newMember.MyOrganisation.Add(organisation);

        // Remove request
        if (organisation.Requests != null) organisation.Requests.Remove(newMember);
        if (newMember.RequestedOrganizations != null) newMember.RequestedOrganizations.Remove(organisation);

        Context.SaveChanges();
    }
    public void RejectRequest(Users user, string organisationUniqueName, int requestUserId) // Rejects a user's join request for a specific organization.
    {
        // Ensure the user has the necessary permission to reject join requests for the organization.
        EnsureUserHasPermission(user, organisationUniqueName, role => role.CanAcceptUsers);
        Organisations organisation = GetObjOrganisation(organisationUniqueName);
        
        Users? rejectedMember = Context.Users
            .Include(u => u.MyOrganisation)
            .Include(u => u.RequestedOrganizations)
            .FirstOrDefault(u => u.Id == requestUserId);
        if (rejectedMember is null)
        {
            throw new CodeException("User with given id does not exist", StatusCodes.Status404NotFound);
        }
        // Remove request
        if (organisation.Requests != null) organisation.Requests.Remove(rejectedMember);
        if (rejectedMember.RequestedOrganizations != null) rejectedMember.RequestedOrganizations.Remove(organisation);

        Context.SaveChanges();
    }
    public List<MinUserDto> GetMembers(string organizationUniqueName)
    {
        Organisations? organisation = Context.Organizations
            .Include(o => o.Members)
            .FirstOrDefault(o => o.UniqueName == organizationUniqueName);
        
        if (organisation is null)
        {
            throw new CodeException("Organisation does not exist", StatusCodes.Status404NotFound);
        }

        if (organisation.Members != null) return organisation.Members.Select(u => new MinUserDto(u)).ToList();
        return [];
    }
    public void RemoveMember(Users user, string organisationUniqueName, int removeUserId)
    {
        if (user.Id != removeUserId)
        {
            EnsureUserHasPermission(user, organisationUniqueName, role => role.CanRemoveUsers);
        }
        
        Organisations organisation = Context.Organizations
            .Include(o => o.Members)
            .FirstOrDefault(o => o.UniqueName == organisationUniqueName)!;
        Users? member = Context.Users
            .Include(u => u.MyOrganisation)
            .Include(u => u.OrganizationRoles)!.ThenInclude(organisationRoles => organisationRoles.Organisation)
            .FirstOrDefault(u => u.Id == removeUserId);
        if (member is null)
        {
            throw new CodeException("User with given id does not exist", StatusCodes.Status404NotFound);
        }

        if (organisation.Members != null) organisation.Members.Remove(member);
        if (member.MyOrganisation != null) member.MyOrganisation.Remove(organisation);

        if (member.OrganizationRoles != null)
        {
            OrganisationRoles? role = member.OrganizationRoles.FirstOrDefault(o => o.Organisation == organisation);
            if (role is not null)
            {
                member.OrganizationRoles.Remove(role);
            }
        }

        Context.SaveChanges();
    }
    public PaginatedList<MinOrganisationDto> SearchOrganization(string searchString, int page)
    {
        int pageSize = Configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();

        var foundOrganisations = Context.Organizations
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
    public FullOrganisationDto GetOrganisation(string organisationUniqueName) // gets full organisation data and returns it in DTO
    {
        return new FullOrganisationDto(GetObjOrganisation(organisationUniqueName));
    }

    public Organisations GetObjOrganisation(string organisationUniqueName) // gets full organisation data and returns it as just entity
    {
        Organisations? org = Context.Organizations
            .Include(o => o.Requests)
            .Include(o => o.Creator)
            .Include(o => o.Members)
            .Include(o => o.Roles)
            .Include(o => o.VerificationRequest)
            .FirstOrDefault(o => o.UniqueName == organisationUniqueName);
        // if organisation not exist throw 404
        if (org is null) throw new CodeException("Organisation does not exist", StatusCodes.Status404NotFound);

        return org;
    }

    public FullOrganisationDto UpdateOrganisation(OrganisationUpdateFormDto organisation, Users user)
    {
        Organisations? organisationToUpdate = Context.Organizations.FirstOrDefault(o => o.Id == organisation.Id);
        if (organisationToUpdate is null) throw new CodeException("Organisation does not exist", StatusCodes.Status404NotFound);
        
        EnsureUserHasPermission(user, organisationToUpdate.UniqueName, role => role.CanConfigureOrganization);

        Organisations? org = Context.Organizations.FirstOrDefault(o => o.UniqueName == organisation.UniqueName);
        if (org is not null && org.Id != organisationToUpdate.Id)
        {
            throw new CodeException("Organisation UniqueName is taken", StatusCodes.Status400BadRequest);
        }
        
        string? logoPath = fileService.UpdateFile(organisationToUpdate.OrganizationLogo, organisation.OrganizationLogo, "organisations", new List<string> { "png", "jpg", "jpeg", "gif" }, 4);
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

        Context.SaveChanges();

        return new FullOrganisationDto(organisationToUpdate);
    }
    public void RemoveOrganisation(string organisationUniqueName, Users user)
    {
        Organisations? organisation = Context.Organizations.FirstOrDefault(o => o.UniqueName == organisationUniqueName);
        if (organisation is null) throw new CodeException("Organisation does not exist", StatusCodes.Status404NotFound);
        
        EnsureUserHasPermission(user, organisationUniqueName, role => role.CanDeleteOrganization);
        
        if (!string.IsNullOrEmpty(organisation.OrganizationLogo))
        {
            fileService.DeleteFile(organisation.OrganizationLogo);
        }

        Context.Organizations.Remove(organisation);
        Context.SaveChanges();
    }
    // Validates whether a user has the required permission for a specific organization.
    public void EnsureUserHasPermission(Users user, string organisationUniqueName, Func<OrganisationRoles, bool> permissionCheck)
    {
        // Retrieve the full details of the organization by its unique name.
        FullOrganisationDto organisation = GetOrganisation(organisationUniqueName);
        if (organisation.Roles == null || !organisation.Roles.Any() && (organisation.CreatorId != user.Id && !user.IsAdmin))  // Ensure that the organization has roles defined, otherwise, throw exception.
        {
            throw new CodeException("No roles associated with the organisation.", StatusCodes.Status404NotFound);
        }
        
        // Attempt to find the role associated with the user in the organization.
        OrganisationRoles? userRole = organisation.Roles.FirstOrDefault(role => role.UsersWithRole?.Any(u => u.Id == user.Id) == true);

        // If neither condition is met, throw a forbidden exception.
        if ((userRole is null || !permissionCheck(userRole)) && organisation.CreatorId != user.Id && !user.IsAdmin)
        {
            throw new CodeException("Access denied", StatusCodes.Status403Forbidden);
        }
    }

    public FullRoleDto CreateRole(Organisations organisation, RolesFormDto role)
    {
        string? image = role.Image;
        if (!string.IsNullOrEmpty(image))
        {
            image = fileService.SaveFile(image, "organisations",
                new List<string> { "png", "jpg", "jpeg", "gif" }, 4);
        }
        EntityEntry<OrganisationRoles> newRole = Context.OrganizationRoles.Add(new OrganisationRoles()
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

        Context.SaveChanges();
        return new FullRoleDto(newRole.Entity);
    }

    public FullRoleDto UpdateRole(Organisations organisation, RolesFormDto role, int roleId)
    {
        OrganisationRoles? roleToUpdate = Context.OrganizationRoles.FirstOrDefault(r => r.Id == roleId);
        if (roleToUpdate is null) throw new CodeException("role is not exist", StatusCodes.Status404NotFound);
        
        string? logoPath =fileService.UpdateFile(roleToUpdate.Image, role.Image, "organisations",
            new List<string> { "png", "jpg", "jpeg", "gif" }, 4);

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
        Context.SaveChanges();

        return new FullRoleDto(roleToUpdate);
    }

    public void DeleteRole(int roleId)
    {
        OrganisationRoles? roleToUpdate = Context.OrganizationRoles.FirstOrDefault(r => r.Id == roleId);
        if (roleToUpdate is null) throw new CodeException("role is not exist", StatusCodes.Status404NotFound);

        Context.OrganizationRoles.Remove(roleToUpdate);
        Context.SaveChanges();
    }

    public void GrantRole(Organisations organisation, Users? user, int roleId)
    {
        OrganisationRoles? roleToUpdate = Context.OrganizationRoles
            .Include(o => o.UsersWithRole)
            .FirstOrDefault(r => r.Id == roleId);
        if (roleToUpdate is null) throw new CodeException("role is not exist", StatusCodes.Status404NotFound);
        if (roleToUpdate.UsersWithRole != null && user != null && roleToUpdate.UsersWithRole.Contains(user)) throw new CodeException("user have that role", StatusCodes.Status400BadRequest);

        if (user != null) roleToUpdate.UsersWithRole?.Add(user);
        Context.SaveChanges();
    }

    public void RevokeRole(Organisations organisation, Users? user, int roleId)
    {
        OrganisationRoles? roleToUpdate = Context.OrganizationRoles
            .Include(o => o.UsersWithRole)
            .FirstOrDefault(r => r.Id == roleId);
        if (roleToUpdate is null) throw new CodeException("role is not exist", StatusCodes.Status404NotFound);
        if (roleToUpdate.UsersWithRole != null && user != null && !roleToUpdate.UsersWithRole.Contains(user)) throw new CodeException("user doesn't have that role", StatusCodes.Status400BadRequest);

        if (user != null) roleToUpdate.UsersWithRole?.Remove(user);
        Context.SaveChanges();
    }

    public OrganizationVerificationRequests AddVerificationRequest(string organisationUniqueName, Users user, string description) // requests a verification of the organisation
    { 
        Organisations organisation = GetObjOrganisation(organisationUniqueName); // get organisation (with not null validation)
        EnsureUserHasPermission(user, organisationUniqueName, o => o.CanConfigureOrganization); // ensure user making request have permission to do so

        if (organisation.VerificationRequest is not null) // check if request wasn't sent already
        {
            throw new CodeException("Request was already sent", StatusCodes.Status400BadRequest);
        }

        EntityEntry<OrganizationVerificationRequests> newRequest = Context.OrganizationVerificationRequests.Add( // create new request
            new OrganizationVerificationRequests()
            {
                OrganisationId = organisation.Id,
                Description = description
            });

        Context.SaveChanges(); // save
        return newRequest.Entity;
    }
}