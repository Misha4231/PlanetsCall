using System.ComponentModel.DataAnnotations;

namespace Data.Models;

public class Achievements
{
    [Key]
    public int Id { get; set; }
    [MaxLength(250)]
    public required string Title { get; set; }
    public bool IsAchievement { get; set; }
    public DateTime CreatedAt { get; set; }
    [MaxLength(300)]
    public string? Image { get; set; }
    
    public ICollection<UserAchievements>? UserAchievementsCollection { get; set; }
}