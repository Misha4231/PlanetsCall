using Core.User;
using Data.Context;
using Data.Models;
using Microsoft.Extensions.Configuration;

namespace Data.Repository.User;

public class UsersRepository : IUsersRepository
{
    private readonly PlatensCallContext _context;
    private readonly IConfiguration _configuration;
    public UsersRepository(PlatensCallContext context, IConfiguration configuration)
    {
        this._context = context;
        this._configuration = configuration;
    }

    public IEnumerable<Users> GetUsers()
    {
        return _context.Users.ToList();
    }

    public Users? GetUserById(int id)
    {
        return _context.Users.Find(id);
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
            var passwordManager = new PasswordManager(_configuration["SecretKey"]);
            user.Password = passwordManager.Encrypt(user.Password);
        }
        
        _context.Users.Add(user);
        Save();
        return user;
    }

    public void Save()
    {
        _context.SaveChanges();
    }
}