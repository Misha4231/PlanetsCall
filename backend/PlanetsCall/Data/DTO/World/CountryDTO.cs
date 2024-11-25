using System.ComponentModel.DataAnnotations;

namespace Data.DTO.World;

public class CountryDto
{
    public required long Id { get; set; }
    [MaxLength(100)]
    public required string Name { get; set; }
}