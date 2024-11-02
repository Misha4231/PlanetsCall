using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("countries")]
public class Countries
{
    [Key]
    [Column("id")]
    public long Id { get; set; }
    
    [Column("name")]
    [MaxLength(100)]
    [Required]
    public required string Name { get; set; }
    
    [Column("iso3")]
    [MaxLength(3)]
    public string? Iso3 { get; set; }
    
    [Column("numeric_code")]
    [MaxLength(3)]
    public string? NumericCode { get; set; }
    
    [Column("iso2")]
    [MaxLength(2)]
    public string? Iso2 { get; set; }
    
    [Column("phonecode")]
    [MaxLength(255)]
    public string? PhoneCode { get; set; }
    
    [Column("capital")]
    [MaxLength(255)]
    public string? Capital { get; set; }
    
    [Column("currency")]
    [MaxLength(255)]
    public string? Currency { get; set; }
    
    [Column("currency_name")]
    [MaxLength(255)]
    public string? CurrencyName { get; set; }
    
    [Column("currency_symbol")]
    [MaxLength(255)]
    public string? CurrencySymbol { get; set; }
    
    [Column("tld")]
    [MaxLength(255)]
    public string? Tld { get; set; }
    
    [Column("native")]
    [MaxLength(255)]
    public string? Native { get; set; }
    
    [Column("region")]
    [MaxLength(255)]
    public string? RegionName { get; set; }
    [Column("region_id")]
    public required long RegionId { get; set; }
    public required Regions Region { get; set; }
    
    [Column("subregion")]
    [MaxLength(255)]
    public string? SubregionName { get; set; }
    [Column("subregion_id")]
    public required long SubregionId { get; set; }
    public required Subregions Subregion { get; set; }
    
    [Column("nationality")]
    [MaxLength(255)]
    public string? Nationality { get; set; }
    
    [Column("timezones")]
    public string? Timezones { get; set; }
    
    [Column("translations")]
    public string? Translations { get; set; }
    
    [Column("latitude")]
    public required decimal Latitude { get; set; }
    [Column("longitude")]
    public required decimal Longitude { get; set; }
    
    [Column("emoji")]
    [MaxLength(191)]
    public string? Emoji { get; set; }
    
    [Column("emojiU")]
    [MaxLength(191)]
    public string? EmojiU { get; set; }
    
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
    public required ICollection<States> StatesCollection { get; set; }
    public ICollection<Users>? UsersCollection { get; set; }
}

