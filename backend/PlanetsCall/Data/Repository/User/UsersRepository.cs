using System.Drawing.Imaging;
using Core;
using Core.User;
using Data.Context;
using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PlanetsCall.Controllers.Exceptions;

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

    public PaginatedList<MinUserDto> SearchUsers(string searchString, int page) // simple full text search with pagination
    {
        int pageSize = _configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>(); // how many items per page are being fetched in pagination

        // search by username, first name and last name, then wrap it to min user dto
        var users = _context.Users
            .OrderBy(u => u.Id) // sort
            .Where(u => u.Username.ToLower().Contains(searchString.ToLower()) ||
                        (u.FirstName != null && u.FirstName.ToLower().Contains(searchString.ToLower())) ||
                        (u.LastName != null && u.LastName.ToLower().Contains(searchString.ToLower())))
            .Select(u => new MinUserDto(u));
            
        // pagination
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

    public Users UpdateUser(UpdateUserDto user, int userId) // update user from UpdateUserDto with assigning all values
    {
        Users userToUpdate = GetUserById(userId)!; // get user (existing must be checked earlier)

        // assign values from DTO to model
        userToUpdate.Email = user.Email;
        userToUpdate.Username = user.Username;
        userToUpdate.FirstName = user.FirstName;
        userToUpdate.LastName = user.LastName;
        userToUpdate.BirthDate = user.BirthDate;
        userToUpdate.BirthDate = user.BirthDate;
        // update profile image
        userToUpdate.ProfileImage = _fileService.UpdateFile(userToUpdate.ProfileImage ,user.ProfileImage, "profile_icons",new ImageFormat[] {ImageFormat.Jpeg, ImageFormat.Png}, 4);
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

    public ErrorResponse? UpdateUserValidation(UpdateUserDto user, int userId) // validation before big user update
    {
        // check if user exists
        Users? userToUpdate = GetUserById(userId); 
        if (userToUpdate is null) return new ErrorResponse(new List<string>(), StatusCodes.Status404NotFound, "");
        
        List<string> errorMessages = new List<string>();
        // check if provided data is valid
        if (userToUpdate.Email != user.Email && GetUserByEmail(user.Email) != null) errorMessages.Add("User with given email is already exists");
        if (userToUpdate.Username != user.Username && GetUserByUsername(user.Username) != null) errorMessages.Add("User with given username is already exists");
        if (user.Passwords != null) errorMessages.AddRange(user.Passwords.IsValid());
        if (user.CityId != null && !_context.Cities.Any(c => c.Id == user.CityId)) errorMessages.Add("Invalid CityId provided.");
        if (user.CountryId != null && !_context.Countries.Any(c => c.Id == user.CountryId)) errorMessages.Add("Invalid CountryId provided.");
        
        // in case some mistakes found, return null
        return errorMessages.Count() != 0 ? new ErrorResponse(errorMessages, StatusCodes.Status400BadRequest, "") : null;
    }

    public void DeleteUser(Users user)
    {
        // delete avatar file
        if (user.ProfileImage != null) _fileService.DeleteFile(user.ProfileImage);
        
        // delete user and additional data related to it
        _context.Users.Remove(user);
        var logs = _context.Logs.Where(log => log.UserId == user.Id).ToList();
        _context.RemoveRange(logs);
        
        _context.SaveChanges();
    }
}