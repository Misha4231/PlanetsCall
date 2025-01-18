using System.ComponentModel.DataAnnotations;
using Data.Models;

namespace Data.DTO.Item;

public class CategoriesListMember
{
    public int Id { get; set; }
    [MaxLength(50)]
    public string Title { get; set; }
    public DateTime CreatedAt { get; set; }
    [MaxLength(300)]
    public string? Image { get; set; }
    public int AttachedItemsCount { get; set; }
    
    public CategoriesListMember(ItemsCategory category)
    {
        Id = category.Id;
        Title = category.Title;
        CreatedAt = category.CreatedAt;
        Image = category.Image;
        AttachedItemsCount = category.AttachedItems?.Count ?? 0; // Handles null AttachedItems
    }
}