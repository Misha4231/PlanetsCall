using System.Drawing;
using System.Drawing.Imaging;
using Microsoft.AspNetCore.Hosting;

namespace Core;

public class FileService
{
    private readonly IWebHostEnvironment _webHostEnvironment;

    public FileService(IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
    }

    public string SaveFile(string b64File, string directory, IEnumerable<ImageFormat> allowedExtensions, int maxWeight)
    {
        var wwwPath = _webHostEnvironment.WebRootPath;
        var path = Path.Combine(wwwPath, directory);
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        byte[] image = Convert.FromBase64String(b64File);
        if (image.Length > (maxWeight * 1024 * 1024))
        {
            throw new InvalidOperationException("File size exceeds the maximum allowed size");
        }
        
        using (var ms = new MemoryStream(image))
        {
            Image img = Image.FromStream(ms);
            if (!allowedExtensions.Contains(img.RawFormat))
            {
                throw new InvalidOperationException("File type not allowed");
            }
            
            string? extension = new ImageFormatConverter().ConvertToString(img.RawFormat);
            var fileName = $"{Guid.NewGuid()}.{extension}";
            var filePath = Path.Combine(path, fileName);

            img.Save(filePath); // Save the image

            return Path.Combine(directory, fileName);;
        }
    }

    public void DeleteFile(string fileDir)
    {
        var wwwPath = Path.Combine(_webHostEnvironment.WebRootPath, fileDir);
        File.Delete(wwwPath);
    }
}