using System.ComponentModel.DataAnnotations;
using Data.Models;

namespace Data.DTO.User;

public class FullUserDto
{
    public FullUserDto(Users user)
    {
        Id = user.Id;
            Email = user.Email;
            Username = user.Username;
            AccountType = user.AccountType;
            IsActivated = user.IsActivated;
            IsBlocked = user.IsBlocked;
            FirstName = user.FirstName;
            LastName = user.LastName;
            BirthDate = user.BirthDate;
            Points = user.Points;
            Progress = user.Progress;
            ProfileImage = user.ProfileImage;
            CreatedAt = user.CreatedAt;
            UpdatedAt = user.UpdatedAt;
            LastLogin = user.LastLogin;
            IsAdmin = user.IsAdmin;
            PreferredLanguage = user.PreferredLanguage;
            IsNotifiable = user.IsNotifiable;
            IsVisible = user.IsVisible;
            Description = user.Description;
            Status = user.Status;
            InstagramLink = user.InstagramLink;
            LinkedinLink = user.LinkedinLink;
            YoutubeLink = user.YoutubeLink;
            CityId = user.CityId;
            City = user.City;
            CountryId = user.CountryId;
            Country = user.Country;
            MailsSubscribed = user.MailsSubscribed;
            ThemePreference = user.ThemePreference;
            SingleTasksCompleted = user.SingleTasksCompleted;
            GroupTasksCompleted = user.GroupTasksCompleted;
            Friends = user.Friends;
            FriendsOf = user.FriendsOf;
            OwnedOrganizations = user.OwnedOrganizations;
            OrganizationRoles = user.OrganizationRoles;
            AchievementsCollection = user.AchievementsCollection;
            TasksCreatedCollection = user.TasksCreatedCollection;
            TasksCompleted = user.TasksCompleted;
            TasksVerified = user.TasksVerified;
            CreatedTopics = user.CreatedTopics;
            LikedTopics = user.LikedTopics;
            TopicCommentsCollection = user.TopicCommentsCollection;
            LikedCommentsCollection = user.LikedCommentsCollection;
            ItemsCollection = user.ItemsCollection;
            Actions = user.Actions;

    }
    public int Id { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public int AccountType { get; set; }
    public bool IsActivated { get; set; }
    public bool IsBlocked { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime BirthDate { get; set; }
    public int Points { get; set; }
    public uint Progress { get; set; }
    public string? ProfileImage { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime LastLogin { get; set; }
    public bool IsAdmin { get; set; }
    public string PreferredLanguage { get; set; }
    public bool IsNotifiable { get; set; }
    public bool IsVisible { get; set; }
    public string? Description { get; set; }
    public string Status { get; set; }
    public string? InstagramLink { get; set; }
    public string? LinkedinLink { get; set; }
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
    public ICollection<OrganizationUserRoles>? OrganizationRoles { get; set; }
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
}