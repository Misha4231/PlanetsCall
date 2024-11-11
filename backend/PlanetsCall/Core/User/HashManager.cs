using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace Core.User;

public class HashManager
{
    private readonly IConfiguration _configuration;
    
    public HashManager(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string Encrypt(string plainText)
    {
        using (var sha256 = SHA256.Create())
        {
            byte[] secretBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(_configuration["SecretKey"]!));
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);

            using (Aes aes = Aes.Create())
            {
                aes.Key = secretBytes;
                aes.Mode = CipherMode.ECB;
                aes.Padding = PaddingMode.PKCS7;

                byte[] encryptedBytes;
                using (var encryptor = aes.CreateEncryptor())
                {
                    encryptedBytes = encryptor.TransformFinalBlock(plainTextBytes, 0, plainTextBytes.Length);
                }

                return Convert.ToBase64String(encryptedBytes);
            }
        }
    }
    
    public string Decrypt(string encodedString)
    {
        using (var sha256 = SHA256.Create())
        {
            byte[] secretBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(_configuration["SecretKey"]!));
            try
            {
                byte[] encryptedBytes = Convert.FromBase64String(encodedString);
                
                using (Aes aes = Aes.Create())
                {
                    aes.Key = secretBytes;
                    aes.Mode = CipherMode.ECB;
                    aes.Padding = PaddingMode.PKCS7;

                    byte[]? decryptedBytes = null;
                    using (var decryptor = aes.CreateDecryptor())
                    {
                        decryptedBytes = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
                    }

                    return Encoding.UTF8.GetString(decryptedBytes);
                }
                
            } catch (Exception e)
            {
                return "";
            }
        }
    }
}