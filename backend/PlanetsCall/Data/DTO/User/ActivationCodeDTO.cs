using System.ComponentModel.DataAnnotations;

namespace Data.DTO.User;

public class DisposableCodeDto
{
    [Required]
    [MaxLength(500)]
    public required string Code { get; set; }
}

public class AccessTokenDto
{
    [Required]
    [MaxLength(500)]
    public required string AccessToken { get; set; }
}