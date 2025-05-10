using System.Drawing.Imaging;
using Core;
using Core.Exceptions;
using Core.User;
using Data.Context;
using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.User;

public class UsersRepository(
    PlatensCallContext context,
    HashManager hashManager,
    FileService fileService,
    IConfiguration configuration)
    : RepositoryBase(context, configuration), IUsersRepository
{
    public IEnumerable<Users?> GetUsers()
    {
        return Context.Users.ToList();
    }

    public PaginatedList<MinUserDto> SearchUsers(string searchString, int page) // simple full text search with pagination
    {
        int pageSize = Configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>(); // how many items per page are being fetched in pagination

        // search by username, first name and last name, then wrap it to min user dto
        var users = Context.Users
            .OrderBy(u => u.Id) // sort
            .Where(u => u.Username != null && (u.Username.ToLower().Contains(searchString.ToLower()) ||
                                               (u.FirstName != null && u.FirstName.ToLower().Contains(searchString.ToLower())) ||
                                               (u.LastName != null && u.LastName.ToLower().Contains(searchString.ToLower()))))
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
        return Context.Users.Find(id);
    }
    
    public Users? GetFullUserById(int id)
    {
        return Context.Users
                .Include(u => u.City)
                .Include(u => u.Country)
                .FirstOrDefault(u => u.Id == id)!;
    }

    public Users? GetUserByUsername(string? username)
    {
        return Context.Users.FirstOrDefault(u => u.Username == username);
    }

    public Users? GetUserByEmail(string? email)
    {
        return Context.Users.FirstOrDefault(u => u.Email == email);
    }

    public Users? InsertUser(Users? user) // Insert user to database
    {
        if (!string.IsNullOrEmpty(user?.Password)) // check in case user uses another way of authorization
        {
            user.Password = hashManager.Encrypt(user.Password); // passwords are stored in encrypted way
        }

        if (user != null)
        {
            Context.Users.Add(user); // add to table
            Context.SaveChanges(); // save changes
        }
        return user;
    }

    public Users? UpdateUser(Users? user) // updates user
    {
        if (user != null)
        {
            user.UpdatedAt = DateTime.Now; // update the UpdatedAt time to now
            Context.Users.Update(user);
            Context.SaveChanges();

            return user;
        }
        return user;
    }

    public Users? UpdateUser(UpdateUserDto user, int userId) // update user from UpdateUserDto with assigning all values
    {
        Users? userToUpdate = GetUserById(userId)!; // get user (existing must be checked earlier)

        // assign values from DTO to model
        userToUpdate.Email = user.Email;
        userToUpdate.Username = user.Username;
        userToUpdate.FirstName = user.FirstName;
        userToUpdate.LastName = user.LastName;
        userToUpdate.BirthDate = user.BirthDate;
        userToUpdate.BirthDate = user.BirthDate;
        // update profile image
        userToUpdate.ProfileImage = fileService.UpdateFile(userToUpdate.ProfileImage ,user.ProfileImage, "profile_icons",new List<string> { "png", "jpg", "jpeg", "gif" }, 4);
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
            userToUpdate.Password = hashManager.Encrypt(user.Passwords.Password!);
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
        if (user.CityId != null && !Context.Cities.Any(c => c.Id == user.CityId)) errorMessages.Add("Invalid CityId provided.");
        if (user.CountryId != null && !Context.Countries.Any(c => c.Id == user.CountryId)) errorMessages.Add("Invalid CountryId provided.");
        
        // in case some mistakes found, return null
        return errorMessages.Count() != 0 ? new ErrorResponse(errorMessages, StatusCodes.Status400BadRequest, "") : null;
    }

    public void DeleteUser(Users? user)
    {
        // delete avatar file
        if (user != null && user.ProfileImage != null) fileService.DeleteFile(user.ProfileImage);
        
        // delete user and additional data related to it
        if (user != null)
        {
            Context.Users.Remove(user);
            var logs = Context.Logs.Where(log => log.UserId == user.Id).ToList();
            Context.RemoveRange(logs);
        }

        Context.SaveChanges();
    }

    public void ResetUserData(Users user) // resets user data
    {
        Users? fullUser = Context.Users // get user with all related data
            .Include(u => u.Friends)
            .Include(u => u.AchievementsCollection)
            .Include(u => u.CreatedTopics)
            .Include(u => u.ItemsCollection)
            .Include(u => u.LikedTopics)
            .Include(u => u.MyOrganisation)
            .Include(u => u.OrganizationRoles)
            .Include(u => u.OwnedOrganizations)
            .Include(u => u.RequestedOrganizations)
            .Include(u => u.TasksCompleted)
            .Include(u => u.TasksVerified)
            .Include(u => u.LikedCommentsCollection)
            .Include(u => u.TopicCommentsCollection)
            .First(u => u.Id == user.Id);

        // reset everything
        fullUser?.Friends?.Clear();
        fullUser?.AchievementsCollection?.Clear();
        fullUser?.CreatedTopics?.Clear();
        fullUser?.ItemsCollection?.Clear();
        fullUser?.LikedTopics?.Clear();
        fullUser?.MyOrganisation?.Clear();
        fullUser?.OrganizationRoles?.Clear();
        fullUser?.OwnedOrganizations?.Clear();
        fullUser?.RequestedOrganizations?.Clear();
        fullUser?.TasksCompleted?.Clear();
        fullUser?.TasksVerified?.Clear();
        fullUser?.LikedCommentsCollection?.Clear();
        fullUser?.TopicCommentsCollection?.Clear();
        if (fullUser != null)
        {
            fullUser.Progress = 1;
            fullUser.Points = 0;

            UpdateUser(fullUser); // update data in database
        }
    }

    public PaginatedList<MinUserDto> GetUsersPaginated(int page) // gets paginated list of users
    {
        int pageSize = Configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();

        List<MinUserDto> res = Context.Users
            .Select(u => new MinUserDto(u))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var count = res.Count();
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<MinUserDto>(res, page, totalPages);
    }

    public void UpdateUserPoints(int userId, int points)
    {
        var user = GetUserById(userId);        
        if (user is null) return;
        
        int pointsPerLevel = Configuration.GetSection("Settings:PointsPerLevel").Get<int>();
        user.Points += points;
        if (user.Points < 0) user.Points = 0;
        
        uint level = (uint)user.Points / (uint)pointsPerLevel;
        user.Progress = level;
        
        Context.Users.Update(user);
        Context.SaveChanges();
    }
}