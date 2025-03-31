using System.ComponentModel.DataAnnotations;

namespace Data.DTO.Task;

public class VerificationReactionDto
{
    [Key] [Required] public int VerificationId { get; set; }
    public bool Reaction { get; set; } // true - approve, false - reject
    
    [MaxLength(300)]
    public string? Message { get; set; }
}