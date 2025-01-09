using System.ComponentModel.DataAnnotations;

namespace Data.DTO.Community;

public class OrganisationFormDto
{
    [Required]
    [MaxLength(250)]
    public required string Name { get; set; }
    [Required]
    [MaxLength(250)]
    public required string UniqueName { get; set; }
    [MaxLength(250)]
    public string? Description { get; set; }
    [Base64String]
    public string? OrganizationLogo { get; set; }
    [MaxLength(100)]
    public string? InstagramLink { get; set; }
    [MaxLength(100)]
    public string? LinkedinLink { get; set; }
    [MaxLength(100)]
    public string? YoutubeLink { get; set; }
    public bool IsPrivate { get; set; }
    public int MinimumJoinLevel { get; set; }
}