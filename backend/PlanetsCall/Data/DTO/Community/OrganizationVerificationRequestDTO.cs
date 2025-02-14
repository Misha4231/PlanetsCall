using Data.Models;

namespace Data.DTO.Community;

public class OrganizationVerificationRequestDto
{
    public OrganizationVerificationRequestDto(OrganizationVerificationRequests req)
    {
        Id = req.Id;
        if (req.Organisation is not null)
            Organisation = new MinOrganisationDto(req.Organisation);
        Description = req.Description;
    }
    
    public int Id { get; set; }
    public MinOrganisationDto? Organisation { get; set; }
    public string Description { get; set; }
}