using Data.Models;

namespace Data.DTO.User;

public class MinUserDto
{
    public MinUserDto(Users user)
    {
        Id = user.Id;
        Email = user.Email;
        Username = user.Username;
        IsActivated = user.IsActivated;
        IsBlocked = user.IsBlocked;
        FirstName = user.FirstName;
        LastName = user.LastName;
        Points = user.Points;
        Progress = user.Progress;
        ProfileImage = user.ProfileImage;
        IsAdmin = user.IsAdmin;
        PreferredLanguage = user.PreferredLanguage;
        Status = user.Status;
    }
    
    public int Id { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public bool IsActivated { get; set; }
    public bool IsBlocked { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public int Points { get; set; }
    public uint Progress { get; set; }
    public string? ProfileImage { get; set; }
    public bool IsAdmin { get; set; }
    public string PreferredLanguage { get; set; }
    public string Status { get; set; }
}