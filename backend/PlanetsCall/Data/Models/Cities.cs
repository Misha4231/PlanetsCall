using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace Data.Models;

[Table("cities")]
public class Cities
{
    [Key]
    [Column("id")]
    public long Id { get; set; }
    
    [Column("name")]
    [MaxLength(255)]
    [Required]
    public required string Name { get; set; }
    
    [Column("state_id")]
    public required long StateId { get; set; }
    public required States State { get; set; }
    [Column("state_code")]
    [MaxLength(255)]
    [Required]
    public required string StateCode { get; set; }
    
    [Column("country_id")]
    public required long CountryId { get; set; }
    public required Countries Country { get; set; }
    [Column("country_code")]
    [MaxLength(2)]
    [Required]
    public required string CountryCode { get; set; }
    
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
    
    public ICollection<Users>? UsersCollection { get; set; }
}