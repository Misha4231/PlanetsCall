using System.ComponentModel.DataAnnotations;

namespace Data.Models;

public class TopicComments
{
    [Key]
    public int Id { get; set; }

    public int? AnswerToId { get; set; }
    public TopicComments? AnswerTo { get; set; }
    
    public int TopicId { get; set; }
    public required Topics Topic { get; set; }
    
    public int? AuthorId { get; set; }
    public Users? Author { get; set; }
    
    [Required]
    [MaxLength(500)]
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public ICollection<TopicComments>? AnswersCollection { get; set; }
    public ICollection<Users>? UsersLiked { get; set; }
}