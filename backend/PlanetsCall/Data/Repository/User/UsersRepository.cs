using System.Drawing.Imaging;
using Core;
using Core.User;
using Data.Context;
using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.User;

public class UsersRepository : IUsersRepository
{
    private readonly PlatensCallContext _context;
    private readonly IConfiguration _configuration;
    private readonly HashManager _hashManager;
    private readonly FileService _fileService;
    public UsersRepository(PlatensCallContext context, HashManager hashManager, FileService fileService, IConfiguration configuration)
    {
        this._context = context;
        this._hashManager = hashManager;
        this._fileService = fileService;
        this._configuration = configuration;
    }

    public IEnumerable<Users> GetUsers()
    {
        return _context.Users.ToList();
    }

    public PaginatedList<MinUserDto> SearchUsers(string searchString, int page)
    {
        int pageSize = _configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();

        var users = _context.Users
            .OrderBy(u => u.Id)
            .Where(u => u.Username.ToLower().Contains(searchString.ToLower()) ||
                        (u.FirstName != null && u.FirstName.ToLower().Contains(searchString.ToLower())) ||
                        (u.LastName != null && u.LastName.ToLower().Contains(searchString.ToLower())))
            .Select(u => new MinUserDto(u));
            
        var paginatedUsers = users.Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var count = users.Count();
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<MinUserDto>(paginatedUsers, page, totalPages);
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

    public Users InsertUser(Users user) // Insert user to database
    {
        if (!string.IsNullOrEmpty(user.Password)) // check in case user uses another way of authorization
        {
            user.Password = this._hashManager.Encrypt(user.Password); // passwords are stored in encrypted way
        }
        
        _context.Users.Add(user); // add to table
        _context.SaveChanges(); // save changes

        return user;
    }

    public Users UpdateUser(Users user) // updates user
    {
        user.UpdatedAt = DateTime.Now;
        _context.Users.Update(user);
        _context.SaveChanges();

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
        var logs = _context.Logs.Where(log => log.UserId == user.Id).ToList();
        _context.RemoveRange(logs);
        
        _context.SaveChanges();
    }
}