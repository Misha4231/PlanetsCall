using Data.Context;
using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.Community;

public class FriendsRepository : IFriendsRepository
{
    private readonly PlatensCallContext _context;
    private readonly IConfiguration _configuration;
    
    public FriendsRepository(PlatensCallContext context, IConfiguration configuration)
    {
        this._context = context;
        this._configuration = configuration;
    }
    
    
    public PaginatedList<MinUserDto> GetFriends(Users user, int page)
    {
        int pageSize = _configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();

        var friends = _context.Users
            .Include(u => u.FriendsOf)
            .Where(u => u.FriendsOf.Contains(user))
            .Select(u => new MinUserDto(u))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var count = _context.Users.Count(u => u.FriendsOf.Contains(user));
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<MinUserDto>(friends, page, totalPages);
    }

    public PaginatedList<MinUserDto> GetFriends(Users user, int page, string searchString)
    {
        int pageSize = _configuration.GetSection("Settings:Pagination:ItemsPerPage").Get<int>();
        
        var friends = _context.Users
            .Include(u => u.FriendsOf)
            .Where(u => u.FriendsOf.Contains(user))
            .Where(u => u.Username.Contains(searchString))
            .Select(u => new MinUserDto(u))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var count = _context.Users.Count(u => u.FriendsOf.Contains(user));
        var totalPages = (int)Math.Ceiling(count / (double)pageSize);
        
        return new PaginatedList<MinUserDto>(friends, page, totalPages);
    }

    public void AddFriend(Users user, string newFriendUsername)
    {
        Users fullUser = _context.Users.Include(u => u.FriendsOf).First(u => u.Id == user.Id);
        Users? newFriend = _context.Users.Include(u => u.FriendsOf).FirstOrDefault(u => u.Username == newFriendUsername);
        if (newFriend is null)
        {
            throw new Exception("The user with the specified username does not exist");
        }
        
        if (fullUser.FriendsOf.Contains(newFriend))
        {
            throw new Exception("Users are already friends");
        }
        
        fullUser.FriendsOf.Add(newFriend);
        newFriend.FriendsOf.Add(fullUser);
        _context.Users.Update(fullUser);
        _context.SaveChanges();
    }

    public void DeleteFriend(Users user, string friendUsername)
    {
        Users fullUser = _context.Users.Include(u => u.FriendsOf).First(u => u.Id == user.Id);
        Users? friend = _context.Users.Include(u => u.FriendsOf).FirstOrDefault(u => u.Username == friendUsername);
        if (friend is null)
        {
            throw new Exception("The user with the specified username does not exist");
        }
        
        if (!fullUser.FriendsOf.Contains(friend))
        {
            throw new Exception("Users are not friends");
        }

        fullUser.FriendsOf.Remove(friend);
        friend.FriendsOf.Remove(fullUser);
        _context.Users.Update(fullUser);
        _context.SaveChanges();
    }
}