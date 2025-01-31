using Data.DTO.Community;
using Data.Models;

namespace Data.Repository.Community;

public interface IVerificationRepository
{
    List<OrganizationVerificationRequestDto> GetRequestsList();
    void DeleteRequest(OrganizationVerificationRequests req);
    void VerifyOrganisation(Organisations org);
}