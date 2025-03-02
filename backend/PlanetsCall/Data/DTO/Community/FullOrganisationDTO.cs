using Data.DTO.User;
using Data.Models;

namespace Data.DTO.Community;

public class FullOrganisationDto(Organisations org) : MinOrganisationDto(org)
{
    public DateTime CreatedAt { get; set; } = org.CreatedAt;
    public DateTime UpdatedAt { get; set; } = org.UpdatedAt;
    public MinUserDto Creator { get; set; } = new(org.Creator);
    public ICollection<OrganisationRoles>? Roles { get; set; } = org.Roles;
}