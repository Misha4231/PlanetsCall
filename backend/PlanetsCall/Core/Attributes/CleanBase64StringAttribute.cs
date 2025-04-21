using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Hosting;

namespace Core.Attributes;

// Attribute extends Base64StringAttribute to support base64 strings with header info like "data:image/png;base64" at the beginning
public class CleanBase64StringAttribute : Base64StringAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is string fileString)
        {
            if (fileString.Contains('.')) // i.e. url was passed
            {
                IWebHostEnvironment? webHostEnvironment = (IWebHostEnvironment?)validationContext.GetService(typeof(IWebHostEnvironment));
                if (webHostEnvironment is null)
                {
                    return new ValidationResult("Unable to resolve environment dependency.");
                }

                FileService fileService = new FileService(webHostEnvironment);
                if (fileService.FileExists(fileString)) return ValidationResult.Success; // if file is laying inside wwwroot
            }
            
            string cleanString = RemoveBase64Header(fileString); // remove header
            
            try {
                var unused = Convert.FromBase64String(cleanString); // try to convert pure 64 to bytes
                return ValidationResult.Success;
            }
            catch (Exception)
            {
                return new ValidationResult("The Image field is not a valid Base64 string.");
            }
        }
        return new ValidationResult("The Image field must be a Base64-encoded string.");
    }
    
    private static string RemoveBase64Header(string base64String)
    {
        if (base64String.Contains(','))  // if representation contains header data
        {
            return base64String.Split(',')[1]; // cut it out
        }
        
        return base64String;
    }
}