using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Data.Models;

[Index(nameof(UniqueName), IsUnique = true)]
public class Organisations
{
    [Key] 
    public int Id { get; set; }
    [Required]
    [MaxLength(250)]
    public required string Name { get; set; }
    [Required]
    [MaxLength(250)]
    public required string UniqueName { get; set; }
    [MaxLength(250)]
    public string? Description { get; set; }
    public bool IsVerified { get; set; }
    [MaxLength(250)]
    public string? OrganizationLogo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    [MaxLength(100)]
    public string? InstagramLink { get; set; }
    [MaxLength(100)]
    public string? LinkedinLink { get; set; }
    public string? YoutubeLink { get; set; }
    public bool IsPrivate { get; set; }
    public int MinimumJoinLevel { get; set; }

    public int? CreatorId { get; set; }
    public Users? Creator { get; set; }
    
    public ICollection<OrganisationRoles>? Roles { get; set; }
    public ICollection<Tasks>? TasksCreatedCollection { get; set; }
    public ICollection<Users>? Requests { get; set; }
    public List<Users>? Members { get; set; }
    public OrganizationVerificationRequests? VerificationRequest { get; set; }
}