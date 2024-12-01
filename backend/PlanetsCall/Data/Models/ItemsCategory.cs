using System.ComponentModel.DataAnnotations;

namespace Data.Models;

public class ItemsCategory
{
    [Key]
    public int Id { get; set; }
    [Required]
    [MaxLength(50)]
    public required string Title { get; set; }
    public DateTime CreatedAt { get; set; }
    [MaxLength(300)]
    public string? Image { get; set; }
    
    public ICollection<Items>? AttachedItems { get; set; }
}