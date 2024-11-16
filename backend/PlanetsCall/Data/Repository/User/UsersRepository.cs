using System.Drawing.Imaging;
using Core;
using Core.User;
using Data.Context;
using Data.DTO.User;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.User;

public class UsersRepository : IUsersRepository
{
    private readonly PlatensCallContext _context;
    private readonly HashManager _hashManager;
    private readonly FileService _fileService;
    public UsersRepository(PlatensCallContext context, HashManager hashManager, FileService fileService)
    {
        this._context = context;
        this._hashManager = hashManager;
        this._fileService = fileService;
    }

    public IEnumerable<Users> GetUsers()
    {
        return _context.Users.ToList();
    }

    public Users? GetUserById(int id)
    {
        return _context.Users.Find(id);
    }
    
    public Users? GetFullUserById(int id)
    {
        return _context.Users
                .Include(u => u.City)
                .Include(u => u.Country)
                .FirstOrDefault(u => u.Id == id)!;
    }

    public Users? GetUserByUsername(string username)
    {
        return _context.Users.FirstOrDefault(u => u.Username == username);
    }

    public Users? GetUserByEmail(string email)
    {
        return _context.Users.FirstOrDefault(u => u.Email == email);
    }

    public List<string> UniqueUserValidation(Users user)
    {
        List<string> errorMessages = new List<string>();
        Users? existingUser = GetUserByUsername(user.Username);
        if (existingUser != null)
        {
            errorMessages.Add("User with the same username already exists");
        }
        existingUser = GetUserByEmail(user.Email);
        if (existingUser != null)
        {
            errorMessages.Add("User with the same email already exists");
        }

        return errorMessages;
    }

    public Users InsertUser(Users user)
    {
        if (!string.IsNullOrEmpty(user.Password))
        {
            user.Password = this._hashManager.Encrypt(user.Password);
        }
        
        _context.Users.Add(user);
        Save();
        return user;
    }

    public Users UpdateUser(Users user)
    {
        user.UpdatedAt = DateTime.Now;
        _context.Users.Update(user);
        Save();

        return user;
    }

    public Users UpdateUser(UpdateUserDto user)
    {
        Users userToUpdate = GetUserById(user.Id)!;
        
        
        userToUpdate.Email = user.Email;
        userToUpdate.Username = user.Username;
        userToUpdate.FirstName = user.FirstName;
        userToUpdate.LastName = user.LastName;
        userToUpdate.BirthDate = user.BirthDate;
        userToUpdate.BirthDate = user.BirthDate;
        string? newProfileImage = null;
        if (user.ProfileImage != null)
        {
            if (userToUpdate.ProfileImage != null) _fileService.DeleteFile(userToUpdate.ProfileImage);
            
            newProfileImage = _fileService.SaveFile(user.ProfileImage, "profile_icons",new ImageFormat[] {ImageFormat.Jpeg, ImageFormat.Png}, 4);
        }
        userToUpdate.ProfileImage = newProfileImage;
        userToUpdate.PreferredLanguage = user.PreferredLanguage;
        userToUpdate.IsNotifiable = user.IsNotifiable;
        userToUpdate.IsVisible = user.IsVisible;
        userToUpdate.Description = user.Description;
        userToUpdate.InstagramLink = user.InstagramLink;
        userToUpdate.LinkedinLink = user.LinkedinLink;
        userToUpdate.YoutubeLink = user.YoutubeLink;
        userToUpdate.CityId = user.CityId;
        userToUpdate.CountryId = user.CountryId;
        userToUpdate.MailsSubscribed = user.MailsSubscribed;
        userToUpdate.ThemePreference = user.ThemePreference;
        
        if (user.Passwords != null)
        {
            userToUpdate.Password = this._hashManager.Encrypt(user.Passwords.Password!);
        }

        UpdateUser(userToUpdate);
        return userToUpdate;
    }

    public List<string> UpdateUserValidation(UpdateUserDto user)
    {
        Users userToUpdate = GetUserById(user.Id)!;
        List<string> errorMessages = new List<string>();
        
        if (userToUpdate.Email != user.Email && GetUserByEmail(user.Email) != null) errorMessages.Add("User with given email is already exists");
        if (userToUpdate.Username != user.Username && GetUserByUsername(user.Username) != null) errorMessages.Add("User with given username is already exists");
        if (user.Passwords != null) errorMessages.AddRange(user.Passwords.IsValid());
        if (user.CityId != null && !_context.Cities.Any(c => c.Id == user.CityId)) errorMessages.Add("Invalid CityId provided.");
        if (user.CountryId != null && !_context.Countries.Any(c => c.Id == user.CountryId)) errorMessages.Add("Invalid CountryId provided.");

        return errorMessages;
    }

    public void DeleteUser(Users user)
    {
        if (user.ProfileImage != null) _fileService.DeleteFile(user.ProfileImage);
        
        _context.Users.Remove(user);
        Save();
    }
    
    public void Save()
    {
        _context.SaveChanges();
    }
}