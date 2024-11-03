using System.Security.Cryptography;
using System.Text;

namespace Core.User;

public class PasswordManager
{
    private readonly string _secretKey;

    public PasswordManager(string? secretKey)
    {
        if (string.IsNullOrEmpty(secretKey)) _secretKey = "";
        else _secretKey = secretKey;
    }

    public string Encrypt(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            byte[] secretBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(_secretKey));
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);

            using (Aes aes = Aes.Create())
            {
                aes.Key = secretBytes;
                aes.Mode = CipherMode.ECB;
                aes.Padding = PaddingMode.PKCS7;

                byte[] encryptedBytes;
                using (var encryptor = aes.CreateEncryptor())
                {
                    encryptedBytes = encryptor.TransformFinalBlock(passwordBytes, 0, passwordBytes.Length);
                }

                return Convert.ToBase64String(encryptedBytes);
            }
        }
    }
    
    public string Decrypt(string encodedPassword)
    {
        using (var sha256 = SHA256.Create())
        {
            byte[] secretBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(_secretKey));
            byte[] encryptedBytes = Convert.FromBase64String(encodedPassword);

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
        }
    }
}