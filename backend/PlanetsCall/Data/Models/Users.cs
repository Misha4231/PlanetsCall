using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace Data.Models;

public class Users
{
    [Key]
    public int Id { get; set; }
    [Required]
    [MaxLength(250)]
    public required string? Email { get; set; }
    [Required]
    [MaxLength(250)]
    public required string? Username { get; set; }
    public int AccountType { get; set; }
    public bool IsActivated { get; set; }
    public bool IsBlocked { get; set; }
    [MaxLength(250)]
    public string? FirstName { get; set; }
    [MaxLength(250)]
    public string? LastName { get; set; }
    public DateTime BirthDate { get; set; }
    public int Points { get; set; }
    public uint Progress { get; set; }
    [MaxLength(250)]
    public string? Password { get; set; }
    [MaxLength(300)]
    public string? ProfileImage { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime LastLogin { get; set; }
    public bool IsAdmin { get; set; }
    [MaxLength(5)]
    public required string? PreferredLanguage { get; set; }
    public bool IsNotifiable { get; set; }
    public bool IsVisible { get; set; }
    [MaxLength(300)]
    public string? Description { get; set; }
    [MaxLength(50)]
    public required string? Status { get; set; } //active, offline 
    [MaxLength(100)]
    public string? InstagramLink { get; set; }
    [MaxLength(100)]
    public string? LinkedinLink { get; set; }
    [MaxLength(100)]
    public string? YoutubeLink { get; set; }

    public long? CityId { get; set; }
    public Cities? City { get; set; }
    public long? CountryId { get; set; }
    public Countries? Country { get; set; }
    
    public bool MailsSubscribed { get; set; }
    public int ThemePreference { get; set; }
    public int SingleTasksCompleted { get; set; }
    public int GroupTasksCompleted { get; set; }
    
    public ICollection<Users>? Friends { get; set; }
    public ICollection<Users>? FriendsOf { get; set; }
    
    public ICollection<Organisations>? OwnedOrganizations { get; set; }
    public ICollection<Organisations>? MyOrganisation { get; set; }
    public ICollection<OrganisationRoles>? OrganizationRoles { get; set; }
    
    public ICollection<UserAchievements>? AchievementsCollection { get; set; }
    public ICollection<Tasks>? TasksCreatedCollection { get; set; }
    
    public ICollection<TasksVerification>? TasksCompleted { get; set; }
    public ICollection<TasksVerification>? TasksVerified { get; set; }
    
    
    public ICollection<Topics>? CreatedTopics { get; set; }
    public ICollection<Topics>? LikedTopics { get; set; }
    public ICollection<TopicComments>? TopicCommentsCollection { get; set; }
    public ICollection<TopicComments>? LikedCommentsCollection { get; set; }
    
    public ICollection<Items>? ItemsCollection { get; set; }
    
    public ICollection<Logs>? Actions { get; set; }
    public ICollection<Organisations>? RequestedOrganizations { get; set; }
}