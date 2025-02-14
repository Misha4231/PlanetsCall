using System.ComponentModel.DataAnnotations;
using Data.DTO.User;
using Data.Models;

namespace Data.DTO.Community;

public class MinOrganisationDto
{
    public MinOrganisationDto(Organisations org)
    {
        Id = org.Id;
        Name = org.Name;
        UniqueName = org.UniqueName;
        Description = org.Description;
        IsVerified = org.IsVerified;
        OrganizationLogo = org.OrganizationLogo;
        InstagramLink = org.InstagramLink;
        LinkedinLink = org.LinkedinLink;
        YoutubeLink = org.YoutubeLink;
        IsPrivate = org.IsPrivate;
        MinimumJoinLevel = org.MinimumJoinLevel;
        CreatorId = org.CreatorId;
<<<<<<< HEAD
        Members = org.Members.Select(m => new MinUserDto(m)).ToList();
=======
        if (org.Members is not null)
            Members = org.Members.Select(m => new MinUserDto(m)).ToList();
        else
            Members = new List<MinUserDto>();
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
    }
    public int Id { get; set; }
    public string Name { get; set; }
    public string UniqueName { get; set; }
    public string? Description { get; set; }
    public bool IsVerified { get; set; }
    public string? OrganizationLogo { get; set; }
    public string? InstagramLink { get; set; }
    public string? LinkedinLink { get; set; }
    public string? YoutubeLink { get; set; }
    public bool IsPrivate { get; set; }
    public int MinimumJoinLevel { get; set; }
<<<<<<< HEAD
    public int CreatorId { get; set; }
=======
    public int? CreatorId { get; set; }
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
    public ICollection<MinUserDto> Members { get; set; }
}