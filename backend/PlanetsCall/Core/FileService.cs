using SixLabors.ImageSharp;
using Core.Exceptions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Core;

public class FileService(IWebHostEnvironment webHostEnvironment)
{
    // saves base64 file and returns path to the newly created file
    public string SaveFile(string b64File, string directory /*folder name*/, IEnumerable<string> allowedExtensions, int maxWeight)
    {
        var path = SafeGetDirectory(directory); // get directory
        
        if (b64File.Contains(',')) // if representation contains header data
        {
            b64File = b64File.Split(',')[1]; // cut it out
        }
        
        byte[] imageData; // from base64 to bytes
        try
        {
            imageData = Convert.FromBase64String(b64File);
        }
        catch (FormatException)
        {
            throw new Exception("Invalid base64 format");
        }
        
        if (imageData.Length > (maxWeight * 1024 * 1024)) // validate file size
        {
            throw new CodeException("File size exceeds the maximum allowed size", StatusCodes.Status415UnsupportedMediaType);
        }
        
        using var image = Image.Load(new MemoryStream(imageData)); // load image
        
        var format = Image.DetectFormat(imageData); // Get the image format
        if (format == null || !allowedExtensions.Contains(format.Name.ToLower()))
        {
            throw new Exception("File type not allowed");
        }
        
        var extension = format.FileExtensions.First();
        var fileName = $"{Guid.NewGuid()}.{extension}"; // construct file name
        var filePath = Path.Combine(path, fileName); // final file path

        image.Save(filePath); // Save the image

        return Path.Combine(directory, fileName).Replace("\\", "/"); // return wwwroot based path in linux format
    }

    // deletes given file
    public void DeleteFile(string fileDir)
    {
        var wwwPath = Path.Combine(webHostEnvironment.WebRootPath, fileDir); // combine to get full path
        File.Delete(wwwPath); // delete file
    }

    // removes old file and saves new one (mostly used in update method)
    public string? UpdateFile(string? from, string? to, string directory, IEnumerable<string> allowedExtensions, int maxWeight)
    {
        if (from == to) return from; // (base case) if file is not changed
        
        if (!string.IsNullOrEmpty(from)) DeleteFile(from); // if the old file provided - delete
        return !string.IsNullOrEmpty(to) ? SaveFile(to, directory, allowedExtensions, maxWeight) : // if the new file provided - save
            to;
    }

    // save file from IFormFile (used for large file upload)
    public string SaveFile(IFormFile file, string directory, IEnumerable<string> allowedExtensions, int maxWeight)
    {
        var extension = Path.GetExtension(file.FileName);
        if (!allowedExtensions.Contains(extension))
        {
            throw new Exception("File type not allowed");
        }
        
        long size = file.Length;
        if (size > (maxWeight * 1024 * 1024))
        {
            throw new Exception("File size exceeds the maximum allowed size");
        }
        
        string name = Guid.NewGuid().ToString() + extension;
        // construct path
        var path = SafeGetDirectory(directory);
        var filePath = Path.Combine(path, name);
        
        // write file
        using FileStream fileStream = new FileStream(filePath, FileMode.Create);
        file.CopyTo(fileStream);
        
        // turn to unix path
        return Path.Combine(directory, name).Replace("\\", "/");
    }

    private string SafeGetDirectory(string folderName) // ensures folder is created in wwwroot and returns an absolute path to it
    {
        var path = Path.Combine(webHostEnvironment.WebRootPath, folderName); // combine path to wwwroot with given folder
        
        // ensure created
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }
        
        return path;
    }
}