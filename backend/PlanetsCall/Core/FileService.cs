using System.Drawing;
using System.Drawing.Imaging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using PlanetsCall.Controllers.Exceptions;

namespace Core;

public class FileService
{
    private readonly IWebHostEnvironment _webHostEnvironment;

    public FileService(IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
    }

    // saves base64 file and returns path to the newly created file
    public string SaveFile(string b64File, string directory /*folder name*/, IEnumerable<ImageFormat> allowedExtensions, int maxWeight)
    {
        var wwwPath = _webHostEnvironment.WebRootPath; // path to wwwroot
        var path = Path.Combine(wwwPath, directory); // combine path to wwwroot with given folder
        if (!Directory.Exists(path)) // check if folder exists
        {
            Directory.CreateDirectory(path);
        }

        if (b64File.Contains(',')) // if representation contains header data
        {
            b64File = b64File.Split(',')[1]; // cut it out
        }
        
        byte[] image = Convert.FromBase64String(b64File); // from base64 to bytes
        if (image.Length > (maxWeight * 1024 * 1024)) // validate file size
        {
            throw new CodeException("File size exceeds the maximum allowed size", StatusCodes.Status415UnsupportedMediaType);
        }

        using var ms = new MemoryStream(image);
        Image img = Image.FromStream(ms); // create image object
        if (!allowedExtensions.Contains(img.RawFormat)) // validate extentions
        {
            throw new CodeException("File type not allowed", StatusCodes.Status415UnsupportedMediaType);
        }

        string? extension = new ImageFormatConverter().ConvertToString(img.RawFormat);
        var fileName = $"{Guid.NewGuid()}.{extension}"; // construct file name
        var filePath = Path.Combine(path, fileName); // final file path

        img.Save(filePath); // Save the image

        return Path.Combine(directory, fileName).Replace("\\", "/"); // return wwwroot based path in linux format
    }

    // deletes given file
    public void DeleteFile(string fileDir)
    {
        var wwwPath = Path.Combine(_webHostEnvironment.WebRootPath, fileDir); // combine to get full path
        File.Delete(wwwPath); // delete file
    }

    // removes old file and saves new one (mostly used in update method)
    public string? UpdateFile(string? from, string? to, string directory, IEnumerable<ImageFormat> allowedExtensions, int maxWeight)
    {
        if (from == to) return from; // (base case) if file is not changed
        
        if (!string.IsNullOrEmpty(from)) DeleteFile(from); // if the old file provided - delete
        if (!string.IsNullOrEmpty(to)) return SaveFile(to, directory, allowedExtensions, maxWeight); // if the new file provided - save

        return to;
    }
}