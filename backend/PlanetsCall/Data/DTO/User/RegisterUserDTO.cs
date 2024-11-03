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
    [MaxLength(250)]
    public string? Password { get; set; }
    [MaxLength(250)]
    public string? PasswordConfirmation { get; set; }
    public bool AgreedToTermsOfService { get; set; }

    public List<string> IsValid()
    {
        List<string> Messages = new List<string>();
        
        if (!this.AgreedToTermsOfService)
        {
            Messages.Add("You must agree to Terms of service");
        }

        if (string.IsNullOrEmpty(this.Password))
        {
            Messages.Add("Password can't be empty");
        }
        else
        {
            if (this.Password.Length < 6)
            {
                Messages.Add("Password must be at least 6 symbols");
            }
            if (this.Password.Contains(' '))
            {
                Messages.Add("Password must contain white symbols");
            }
            if (!this.Password.Any(char.IsUpper))
            {
                Messages.Add("Password must contain at least 1 upper case character");
            }
        }

        if (string.IsNullOrEmpty(this.PasswordConfirmation))
        {
            Messages.Add("Password confirmation can't be empty");
        }

        if (this.Password != this.PasswordConfirmation)
        {
            Messages.Add("Password and Password confirmation must be same");
        }

        return Messages;
    }
}