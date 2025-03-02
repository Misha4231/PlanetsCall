using Data.DTO.User;
using Data.Models;

namespace Data.DTO.Community;

public class MinOrganisationDto(Organisations org)
{
    public int Id { get; set; } = org.Id;
    public string Name { get; set; } = org.Name;
    public string UniqueName { get; set; } = org.UniqueName;
    public string? Description { get; set; } = org.Description;
    public bool IsVerified { get; set; } = org.IsVerified;
    public string? OrganizationLogo { get; set; } = org.OrganizationLogo;
    public string? InstagramLink { get; set; } = org.InstagramLink;
    public string? LinkedinLink { get; set; } = org.LinkedinLink;
    public string? YoutubeLink { get; set; } = org.YoutubeLink;
    public bool IsPrivate { get; set; } = org.IsPrivate;
    public int MinimumJoinLevel { get; set; } = org.MinimumJoinLevel;
    public int? CreatorId { get; set; } = org.CreatorId;
    public ICollection<MinUserDto> Members { get; set; } = 
        org.Members?.Select(m => new MinUserDto(m)).ToList() ?? [];
}