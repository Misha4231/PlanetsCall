using Data.DTO.User;
using Data.Models;

namespace Data.DTO.Community;

public class FullOrganisationDto : MinOrganisationDto
{
    public FullOrganisationDto(Organisations org) : base(org)
    {
        CreatedAt = org.CreatedAt;
        UpdatedAt = org.UpdatedAt;
        Creator = new MinUserDto(org.Creator);
        Roles = org.Roles;
    }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public MinUserDto Creator { get; set; }
    public ICollection<OrganisationRoles> Roles { get; set; }
}