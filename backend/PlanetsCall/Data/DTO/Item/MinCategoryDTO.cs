using System.ComponentModel.DataAnnotations;

namespace Data.DTO.Item;

public class MinCategoryDTO
{
    [MaxLength(50)]
    public required string Title { get; set; }
    [Base64String]
    public required string Image { get; set; }
}
public class UpdateCategoryDto
{
    [Key] 
    public required int Id { get; set; }
    [MaxLength(50)]
    public required string Title { get; set; }
    [Base64String]
    public required string  Image { get; set; }
}