using Data.DTO.Community;
using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;

namespace Data.Repository.Community;

public interface IOrganisationsRepository
{
    PaginatedList<MinOrganisationDto> GetUserOrganisations(Users user, int page);
    void JoinOrganization(Users user, string organisationUniqueName);
    FullOrganisationDto CreateOrganisation(Users user, OrganisationFormDto organisationData);
    List<MinUserDto> GetRequests(Users user, string organisationUniqueName);
    void AcceptRequest(Users user, string organisationUniqueName, int requestUserId);
    void RejectRequest(Users user, string organisationUniqueName, int requestUserId);
    List<MinUserDto> GetMembers(string organizationUniqueName);
    void RemoveMember(Users user, string organisationUniqueName, int removeUserId);
    PaginatedList<MinOrganisationDto> SearchOrganization(string searchString, int page);
    FullOrganisationDto GetOrganisation(string organisationUniqueName);
    Organisations? GetObjOrganisation(string organisationUniqueName);
    FullOrganisationDto UpdateOrganisation(OrganisationUpdateFormDto organisation, Users user);
    void RemoveOrganisation(string organisationUniqueName, Users user);
    void EnsureUserHasPermission(Users user, string organisationUniqueName, Func<OrganisationRoles, bool> permissionCheck);
    FullRoleDto CreateRole(Organisations organisation, RolesFormDto role);
    FullRoleDto UpdateRole(Organisations organisation, RolesFormDto role, int roleId);
    void DeleteRole(int roleId);
    void GrantRole(Organisations organisation, Users user, int roleId);
    void RevokeRole(Organisations organisation, Users user, int roleId);
}