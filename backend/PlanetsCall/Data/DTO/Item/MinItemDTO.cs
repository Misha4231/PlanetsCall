using System.ComponentModel.DataAnnotations;
<<<<<<< HEAD
=======
using Core.Attributes;
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
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
        this.CategoryId = i.CategoryId;
        this.Price = i.Price;
        this.Image = i.Image;
        this.Rarity = i.Rarity;
        this.Title = i.Title;
    }
    public int? CategoryId { get; set; }
    public int Price { get; set; }
<<<<<<< HEAD
    [Base64String]
=======
    [CleanBase64String]
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
    public string Image { get; set; }
    [MaxLength(30)]
    public string Rarity { get; set; }
    [MaxLength(30)]
    public string Title { get; set; }
}

public class UpdateItemDto
{
    [Key]
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public int Price { get; set; }
    [CleanBase64String]
    public string? Image { get; set; }
    [MaxLength(30)]
    public required string Rarity { get; set; }
}