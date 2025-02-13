using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace Core.User;

/*
 * Class to hash strings (using key from configuration)
 */
public class HashManager(IConfiguration configuration)
{
    // holding secret key

    public string Encrypt(string plainText) // encrypts plain text using SHA256 algorithm
    {
        using (var sha256 = SHA256.Create())
        {
            byte[] secretBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(configuration["SecretKey"]!)); // hashing bytes from secret key
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText); 

            using (Aes aes = Aes.Create()) // Advanced Encryption Standard 
            {
                aes.Key = secretBytes; // for the symmetric algorithm
                aes.Mode = CipherMode.ECB;
                aes.Padding = PaddingMode.PKCS7;

                byte[] encryptedBytes; // The encrypted result will be stored here
                using (var encryptor = aes.CreateEncryptor()) // Creates a symmetric encryptor object
                {
                    // transform the plain text bytes into encrypted bytes
                    encryptedBytes = encryptor.TransformFinalBlock(plainTextBytes, 0, plainTextBytes.Length);
                }
                
                // convert to base64 string because encrypted data is binary and not human readable
                return Convert.ToBase64String(encryptedBytes);
            }
        }
    }
    
    public string Decrypt(string encodedString) // decrypts encoded text using SHA256 algorithm
    {
        using (var sha256 = SHA256.Create())
        {
            // ensures we have the same key used during encryption
            byte[] secretBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(configuration["SecretKey"]!));
            try
            {
                // convert back to binary
                byte[] encryptedBytes = Convert.FromBase64String(encodedString);
                
                using (Aes aes = Aes.Create()) // Advanced Encryption Standard 
                {
                    // set up the same configuration used in encoding
                    aes.Key = secretBytes;
                    aes.Mode = CipherMode.ECB;
                    aes.Padding = PaddingMode.PKCS7;

                    byte[]? decryptedBytes = null; // will store result
                    using (var decryptor = aes.CreateDecryptor())
                    {
                        // decrypts to original plaintext byte array
                        decryptedBytes = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
                    }

                    // convert to human readable string
                    return Encoding.UTF8.GetString(decryptedBytes);
                }
                
            } catch ( Exception _) // Errors may occur if the input is invalid, the key does not match
            {
                return "";
            }
        }
    }
}