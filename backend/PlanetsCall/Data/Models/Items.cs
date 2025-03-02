using System.ComponentModel.DataAnnotations;

namespace Data.Models;

public class Items
{
    [Key]
    public int Id { get; set; }
    
    public ItemsCategory? Category { get; set; }
    public int? CategoryId { get; set; }
    public int Price { get; set; }
    public DateTime CreatedAt { get; set; }
    [Required]
    [MaxLength(300)]
    public required string Image { get; set; }
    [Required]
    [MaxLength(30)]
    public required string Rarity { get; set; }

    [Required]
    [MaxLength(30)]
    public required string Title { get; set; }

    
    public ICollection<Users>? Owners { get; set; }
}