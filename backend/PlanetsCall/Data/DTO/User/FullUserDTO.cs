using System.ComponentModel.DataAnnotations;
using Data.DTO.World;
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
            if (user.City != null)
                City = new CityDto() { Id = user.City.Id, Name = user.City.Name };
            CountryId = user.CountryId;
            if (user.Country != null)
                Country = new CountryDto() { Id = user.Country.Id, Name = user.Country.Name };
            MailsSubscribed = user.MailsSubscribed;
            ThemePreference = user.ThemePreference;

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
    public CityDto? City { get; set; }
    public long? CountryId { get; set; }
    public CountryDto? Country { get; set; }
    public bool MailsSubscribed { get; set; }
    public int ThemePreference { get; set; }
}