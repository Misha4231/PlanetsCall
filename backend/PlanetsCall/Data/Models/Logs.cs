using System.ComponentModel.DataAnnotations;
using System.Text.Json.Nodes;

namespace Data.Models;

public class Logs
{
    [Key]
    public int Id { get; set; }
    [Required]
    [MaxLength(50)]
    public required string Type { get; set; }
    
    public required int UserId { get; set; }
    public required Users User { get; set; }
    
    [Required]
    [MaxLength(3000)]
    public required string Data { get; set; }
}