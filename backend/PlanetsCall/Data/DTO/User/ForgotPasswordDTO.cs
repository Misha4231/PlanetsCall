using System.ComponentModel.DataAnnotations;

namespace Data.DTO.User;

public class ForgotPasswordDto
{
    public required NewUserPasswordDto Passwords { get; set; }
    [Required]
    [MaxLength(500)]
    public required string Code { get; set; }
}