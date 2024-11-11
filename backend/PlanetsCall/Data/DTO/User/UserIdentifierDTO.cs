using System.ComponentModel.DataAnnotations;

namespace Data.DTO.User;

public class UserIdentifierDto
{
    [MaxLength(250)]
    [Required]
    public required string UniqueIdentifier { get; set; }
}