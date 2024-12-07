using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;

namespace Data.Repository.User;

public interface IUsersRepository
{
    IEnumerable<Users> GetUsers();
    PaginatedList<MinUserDto> SearchUsers(string searchString, int page);
    Users? GetUserById(int id);
    Users? GetFullUserById(int id);
    Users? GetUserByUsername(string username);
    Users? GetUserByEmail(string email);
    List<string> UniqueUserValidation(Users user);
    Users InsertUser(Users user);
    void Save();
    Users UpdateUser(Users user, string additionalInfo = "");
    Users UpdateUser(UpdateUserDto user);
    List<string> UpdateUserValidation(UpdateUserDto user);
    void DeleteUser(Users user);

}