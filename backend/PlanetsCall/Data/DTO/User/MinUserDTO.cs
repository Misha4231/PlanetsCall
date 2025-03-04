using Data.Models;

namespace Data.DTO.User;

public class MinUserDto(Users? user)
{
    public int Id { get; set; } = user!.Id;
    public string? Email { get; set; } = user.Email;
    public string? Username { get; set; } = user.Username;
    public bool IsActivated { get; set; } = user.IsActivated;
    public bool IsBlocked { get; set; } = user.IsBlocked;
    public string? FirstName { get; set; } = user.FirstName;
    public string? LastName { get; set; } = user.LastName;
    public int Points { get; set; } = user.Points;
    public uint Progress { get; set; } = user.Progress;
    public string? ProfileImage { get; set; } = user.ProfileImage;
    public bool IsAdmin { get; set; } = user.IsAdmin;
    public string? PreferredLanguage { get; set; } = user.PreferredLanguage;
    public string? Status { get; set; } = user.Status;
}