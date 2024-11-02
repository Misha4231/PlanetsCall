using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("subregions")]
public class Subregions
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
    
    [Column("region_id")]
    public required long RegionId { get; set; }
    public required Regions Region { get; set; }
    
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
}