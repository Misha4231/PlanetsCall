using Data.DTO.Community;
using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;

namespace Data.Repository.Community;

public interface IOrganisationsRepository
{
    PaginatedList<Organisations> GetUserOrganisations(Users user, int page);
    void JoinOrganization(Users user, string organisationUniqueName);
    Organisations CreateOrganisation(Users user, MinOrganisationDto organisationData);
    List<MinUserDto> GetRequests(Users user, string organisationUniqueName);
    void AcceptRequest(Users user, string organisationUniqueName, int requestUserId);
    void RejectRequest(Users user, string organisationUniqueName, int requestUserId);
    List<MinUserDto> GetMembers(string organizationUniqueName);
    void RemoveMember(Users user, string organisationUniqueName, int removeUserId);
    PaginatedList<Organisations> SearchOrganization(string searchString, int page);
    Organisations GetOrganisation(string organisationUniqueName);
    Organisations UpdateOrganisation(Organisations organisation);
    void RemoveOrganisation(string organisationUniqueName);
    Organisations HaveAccessToRequests(Users user, string organisationUniqueName);
}