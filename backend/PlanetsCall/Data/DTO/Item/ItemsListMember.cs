using System.ComponentModel.DataAnnotations;

namespace Data.DTO.Item;

public class ItemsListMember
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public int Price { get; set; }
    public DateTime CreatedAt { get; set; }
    [MaxLength(300)]
    public required string Image { get; set; }
    [MaxLength(30)]
    public required string Rarity { get; set; }
}