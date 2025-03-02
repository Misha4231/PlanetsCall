using System.ComponentModel.DataAnnotations;

namespace Data.Models;

public class Tasks
{
    [Key] 
    public int Id { get; set; }
    [MaxLength(250)] 
    [Required]
    public required string? Title { get; set; }
    [MaxLength(500)] 
    
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public int Reward { get; set; }

    public int? AuthorId { get; set; }
    public Users? Author { get; set; }

    public int? OrganizationId { get; set; }
    public Organisations? Organisation { get; set; }

    public int Type { get; set; }
    public bool IsGroup { get; set; }
    public bool IsActive { get; set; }

    public ICollection<TasksVerification>? Verifications { get; set; }
}