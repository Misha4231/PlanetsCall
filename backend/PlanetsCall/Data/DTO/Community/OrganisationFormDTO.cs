using System.ComponentModel.DataAnnotations;
<<<<<<< HEAD
=======
using Core.Attributes;
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda

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
<<<<<<< HEAD
    [Base64String]
=======
    [CleanBase64String]
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
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