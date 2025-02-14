using Data.Context;
using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.Community;

public class FriendsRepository : RepositoryBase, IFriendsRepository
{
<<<<<<< HEAD
    private readonly PlatensCallContext _context;
    private readonly IConfiguration _configuration;
    
    public FriendsRepository(PlatensCallContext context, IConfiguration configuration)
    {
        this._context = context;
        this._configuration = configuration;
    }

    public PaginatedList<MinUserDto> GetFriends(Users user, int page, string? searchString = null) // get list friends of user
    {
        int pageSize = _configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();
        
        // Base query for friends
        var query = _context.Users
=======
    public FriendsRepository(PlatensCallContext context, IConfiguration configuration) : base(context, configuration) {}

    public PaginatedList<MinUserDto> GetFriends(Users user, int page, string? searchString = null) // get list friends of user
    {
        int pageSize = Configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();
        
        // Base query for friends
        var query = Context.Users
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
            .Include(u => u.FriendsOf)
            .Where(u => u.FriendsOf.Contains(user));
        
        // Apply search filter if provided
        if (!string.IsNullOrEmpty(searchString))
        {
            query = query.Where(u => u.Username.Contains(searchString));
        }
        
        // Execute the query with pagination
        var friends = query
            .Select(u => new MinUserDto(u))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        // Calculate total count and pages
<<<<<<< HEAD
        var count = _context.Users.Count(u => u.FriendsOf.Contains(user));
=======
        var count = Context.Users.Count(u => u.FriendsOf.Contains(user));
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<MinUserDto>(friends, page, totalPages);
    }

    public int /*status code*/ AddFriend(Users user, string newFriendUsername)
    {
<<<<<<< HEAD
        Users fullUser = _context.Users.Include(u => u.FriendsOf).First(u => u.Id == user.Id); // get user with friends list
        Users? newFriend = _context.Users.Include(u => u.FriendsOf).FirstOrDefault(u => u.Username == newFriendUsername);
=======
        Users fullUser = Context.Users.Include(u => u.FriendsOf).First(u => u.Id == user.Id); // get user with friends list
        Users? newFriend = Context.Users.Include(u => u.FriendsOf).FirstOrDefault(u => u.Username == newFriendUsername);
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
        if (newFriend is null)
        {
            return StatusCodes.Status404NotFound;
            //throw new Exception("The user with the specified username does not exist");
        }
        
        if (fullUser.FriendsOf.Contains(newFriend))
        {
            return StatusCodes.Status400BadRequest;
            //throw new Exception("Users are already friends");
        }
        // add users to many-to-many relation
        fullUser.FriendsOf.Add(newFriend);
        newFriend.FriendsOf.Add(fullUser);
<<<<<<< HEAD
        _context.Users.Update(fullUser);
        _context.SaveChanges();
=======
        Context.Users.Update(fullUser);
        Context.SaveChanges();
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
        
        return StatusCodes.Status200OK;
    }

    public int DeleteFriend(Users user, string friendUsername) 
    {
        Users fullUser = Context.Users.Include(u => u.FriendsOf).First(u => u.Id == user.Id);
        Users? friend = Context.Users.Include(u => u.FriendsOf).FirstOrDefault(u => u.Username == friendUsername);
        if (friend is null)
        {
            return StatusCodes.Status404NotFound;
        }
        
        if (!fullUser.FriendsOf.Contains(friend))
        {
            return StatusCodes.Status400BadRequest;
        }

        // remove users to many-to-many relation
        fullUser.FriendsOf.Remove(friend);
        friend.FriendsOf.Remove(fullUser);
<<<<<<< HEAD
        _context.Users.Update(fullUser);
        _context.SaveChanges();
=======
        Context.Users.Update(fullUser);
        Context.SaveChanges();
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda
        
        return StatusCodes.Status200OK;
    }
}