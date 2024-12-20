using System.ComponentModel.DataAnnotations;

namespace Data.DTO.World;

public class CityDto
{
    public required long Id { get; set; }
    [MaxLength(255)]
    public required string Name { get; set; }
}