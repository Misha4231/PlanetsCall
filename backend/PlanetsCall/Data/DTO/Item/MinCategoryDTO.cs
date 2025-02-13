using System.ComponentModel.DataAnnotations;
using Core.Attributes;

namespace Data.DTO.Item;

public class MinCategoryDto
{
    [MaxLength(50)]
    public required string Title { get; set; }
    [CleanBase64String]
    public required string Image { get; set; }
}