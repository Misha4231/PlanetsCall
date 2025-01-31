using Data.Context;
using Data.DTO.Community;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.Community;

public class VerificationRepository : RepositoryBase, IVerificationRepository
{
   public VerificationRepository(PlatensCallContext context, IConfiguration configuration) : base(context, configuration) {}

   public List<OrganizationVerificationRequestDto> GetRequestsList()
   { // gets a list of all verification requests and put it into DTO (to make organisation data smaller)
      List<OrganizationVerificationRequestDto> requestsList = Context.OrganizationVerificationRequests
         .Include(r => r.Organisation)
         .Select(r => new OrganizationVerificationRequestDto(r))
         .ToList();

      return requestsList;
   }

   public void DeleteRequest(OrganizationVerificationRequests req) // delete processed request from database
   {
      Context.OrganizationVerificationRequests.Remove(req);
      Context.SaveChanges();
   }

   public void VerifyOrganisation(Organisations org) // verify organisation
   {
      org.IsVerified = true;
      Context.SaveChanges();
   }
}