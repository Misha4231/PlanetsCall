using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("states")]
public class States
{
    [Key]
    [Column("id")]
    public long Id { get; set; }
    
    [Column("name")]
    [MaxLength(255)]
    [Required]
    public required string Name { get; set; }
    
    [Column("country_id")]
    public required long CountryId { get; set; }
    public required Countries Country { get; set; }
    [Column("country_code")]
    [MaxLength(2)]
    [Required]
    public required string CountryCode { get; set; }
    
    [Column("fips_code")]
    [MaxLength(255)]
    public string? FipsCode { get; set; }
    
    [Column("iso2")]
    [MaxLength(255)]
    public string? Iso2 { get; set; }
    
    [Column("type")]
    [MaxLength(191)]
    public string? Type { get; set; }
    
    [Column("latitude")]
    public required decimal Latitude { get; set; }
    [Column("longitude")]
    public required decimal Longitude { get; set; }
    
    [Column("created_at")]
    public required DateTime CreatedAt { get; set; }
    [Column("updated_at")]
    public required DateTime UpdatedAt { get; set; }
    
    [Column("flag")]
    public required Int16 Flag { get; set; }
    
    [Column("wikiDataId")]
    [MaxLength(255)]
    public string? WikiDataId { get; set; }
    
    public required ICollection<Cities> CitiesCollection { get; set; }
}