using System.ComponentModel.DataAnnotations;
using Core.Attributes;
using Data.Models;

namespace Data.DTO.User;

public class UpdateUserDto
{
    [Required]
    [EmailAddress]
    [MaxLength(250)]
    public required string Email { get; set; }
    [Required]
    [MaxLength(250)]
    public required string Username { get; set; }
    [MaxLength(250)]
    public string? FirstName { get; set; }
    [MaxLength(250)]
    public string? LastName { get; set; }
    public DateTime BirthDate { get; set; }
    public NewUserPasswordDto? Passwords { get; set; }
    [CleanBase64String]
    public string? ProfileImage { get; set; }

    [MaxLength(5)]
    public required string PreferredLanguage { get; set; }
    public bool IsNotifiable { get; set; }
    public bool IsVisible { get; set; }
    [MaxLength(300)]
    public string? Description { get; set; }
    [MaxLength(100)]
    public string? InstagramLink { get; set; }
    [MaxLength(100)]
    public string? LinkedinLink { get; set; }
    [MaxLength(100)]
    public string? YoutubeLink { get; set; }
    public long? CityId { get; set; }
    public long? CountryId { get; set; }
    public bool MailsSubscribed { get; set; }
    public int ThemePreference { get; set; }
}