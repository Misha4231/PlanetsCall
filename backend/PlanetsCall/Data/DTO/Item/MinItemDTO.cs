using System.ComponentModel.DataAnnotations;

namespace Data.DTO.Item;

public class MinItemDTO
{
    public int CategoryId { get; set; }
    public int Price { get; set; }
    [Base64String]
    public required string Image { get; set; }
    [MaxLength(30)]
    public required string Rarity { get; set; }
}

public class UpdateItemDTO
{
    [Key]
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public int Price { get; set; }
    [Base64String]
    public string? Image { get; set; }
    [MaxLength(30)]
    public required string Rarity { get; set; }
}