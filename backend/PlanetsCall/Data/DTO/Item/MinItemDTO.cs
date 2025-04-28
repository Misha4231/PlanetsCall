using System.ComponentModel.DataAnnotations;
using Core.Attributes;
using Data.Models;

namespace Data.DTO.Item;

public class MinItemDto
{
    public MinItemDto()
    {
        Image = "";
        Rarity = "";
        Title = "";
    }
    public MinItemDto(Items i)
    {
        this.Id = i.Id;
        this.CategoryId = i.CategoryId;
        this.Price = i.Price;
        this.Image = i.Image;
        this.Rarity = i.Rarity;
        this.Title = i.Title;
    }
    [Key]
    public int Id { get; set; }
    public int? CategoryId { get; set; }
    public uint Price { get; set; }
    [CleanBase64String]
    public string Image { get; set; }
    [MaxLength(30)]
    public string Rarity { get; set; }
    [MaxLength(30)]
    public string Title { get; set; }
}
