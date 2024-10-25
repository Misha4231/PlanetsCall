using System.ComponentModel.DataAnnotations;

namespace Data.Models;

public class Topics
{
    [Key]
    public int Id { get; set; }
    [MaxLength(250)]
    [Required]
    public required string Title { get; set; }
    
    public int? AuthorId { get; set; }
    public Users? Author { get; set; }
    
    public int? OrganizationId { get; set; }
    public Organisations? Organisation { get; set; }
    
    public DateTime CreatedAt { get; set; }

    public ICollection<Users>? UsersLiked { get; set; }
    public ICollection<TopicComments>? Comments { get; set; }
}