using System.ComponentModel.DataAnnotations;

namespace Data.DTO.Item;

public class MinCategoryDto
{
    [MaxLength(50)]
    public required string Title { get; set; }
    [Base64String]
    public required string Image { get; set; }
}