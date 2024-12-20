using Data.Models;

namespace Data.Repository.User;

public interface IUsersRepository
{
    IEnumerable<Users> GetUsers();
    Users? GetUserById(int id);
    Users? GetUserByUsername(string username);
    Users? GetUserByEmail(string email);
    List<string> UniqueUserValidation(Users user);
    Users InsertUser(Users user);
    void Save();
    Users UpdateUser(Users user);
}