using System.ComponentModel.DataAnnotations;

namespace Data.DTO.User;

public class NewUserPasswordDto
{
    [MaxLength(250)]
    public string? Password { get; set; }
    [MaxLength(250)]
    public string? PasswordConfirmation { get; set; }
    
    public List<string> IsValid()
    {
        List<string> messages = new List<string>(); // error messages
        
        if (string.IsNullOrEmpty(this.Password))
        {
            messages.Add("Password can't be empty");
        }
        else
        {
            if (this.Password.Length < 6)
            {
                messages.Add("Password must be at least 6 symbols");
            }
            if (this.Password.Contains(' '))
            {
                messages.Add("Password must contain white symbols");
            }
            if (!this.Password.Any(char.IsUpper))
            {
                messages.Add("Password must contain at least 1 upper case character");
            }
        }

        if (string.IsNullOrEmpty(this.PasswordConfirmation))
        {
            messages.Add("Password confirmation can't be empty");
        }

        if (this.Password != this.PasswordConfirmation)
        {
            messages.Add("Password and Password confirmation must be same");
        }

        return messages;
    }
}