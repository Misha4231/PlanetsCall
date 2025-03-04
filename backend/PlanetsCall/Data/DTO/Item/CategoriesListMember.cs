using System.ComponentModel.DataAnnotations;
using Data.Models;

namespace Data.DTO.Item;

public class CategoriesListMember(ItemsCategory category)
{
    public int Id { get; set; } = category.Id;

    [MaxLength(50)]
    public string Title { get; set; } = category.Title;

    public DateTime CreatedAt { get; set; } = category.CreatedAt;

    [MaxLength(300)]
    public string? Image { get; set; } = category.Image;

    public int AttachedItemsCount { get; set; } = category.AttachedItems?.Count ?? 0; // Handles null AttachedItems
}