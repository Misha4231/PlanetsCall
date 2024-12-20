using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

namespace Data.DTO.User;

public class RegisterUserDto
{
    [EmailAddress]
    [MaxLength(250)]
    [Required]
    public required string Email { get; set; }
    [Required]
    [MaxLength(250)]
    public required string Username { get; set; }
    public NewUserPasswordDto? Passwords { get; set; }
    public bool AgreedToTermsOfService { get; set; }

    public List<string> IsValid()
    {
        List<string> messages = new List<string>();
        
        if (!this.AgreedToTermsOfService)
        {
            messages.Add("You must agree to Terms of service");
        }

        List<string>? passwordMessages = Passwords?.IsValid();
        if (passwordMessages is not null && passwordMessages.Count > 0)
        {
            messages.AddRange(passwordMessages);
        }

        return messages;
    }
}