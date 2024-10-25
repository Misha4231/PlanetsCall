using System.ComponentModel.DataAnnotations;

namespace Data.Models;

public class UserAchievements
{
    [Key]
    public int Id { get; set; }
    
    public int AchievementId { get; set; }
    public required Achievements Achievement { get; set; }
    
    public int UserId { get; set; }
    public required Users User { get; set; }
    
    public DateTime CreatedAt { get; set; }
}