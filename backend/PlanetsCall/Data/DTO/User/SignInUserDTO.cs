using System.ComponentModel.DataAnnotations;

namespace Data.DTO.User;

public class SignInUserDto
{
    [MaxLength(250)]
    [Required]
    public required string UniqueIdentifier { get; set; }
    
    [MaxLength(250)]
    [Required]
    public required string Password { get; set; }
}