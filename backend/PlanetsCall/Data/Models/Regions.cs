using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("regions")]
public class Regions
{
    [Key]
    [Column("id")]
    public long Id { get; set; }
    
    [Column("name")]
    [MaxLength(100)]
    [Required]
    public required string Name { get; set; }
    
    [Column("translations")]
    public string? Translations { get; set; }
    
    [Column("created_at")]
    public required DateTime CreatedAt { get; set; }
    [Column("updated_at")]
    public required DateTime UpdatedAt { get; set; }
    
    [Column("flag")]
    public required Int16 Flag { get; set; }
    
    [Column("wikiDataId")]
    [MaxLength(255)]
    public string? WikiDataId { get; set; }
    
    
    public required ICollection<Countries> CountriesCollection { get; set; }
    public required ICollection<Subregions> SubregionsCollection { get; set; }
}