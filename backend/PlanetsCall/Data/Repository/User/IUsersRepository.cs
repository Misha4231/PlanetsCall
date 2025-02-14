using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;
using PlanetsCall.Controllers.Exceptions;

namespace Data.Repository.User;

public interface IUsersRepository
{
    IEnumerable<Users> GetUsers();
    PaginatedList<MinUserDto> SearchUsers(string searchString, int page);
    Users? GetUserById(int id);
    Users? GetFullUserById(int id);
    Users? GetUserByUsername(string username);
    Users? GetUserByEmail(string email);
    Users InsertUser(Users user);
    Users UpdateUser(Users user);
    Users UpdateUser(UpdateUserDto user, int userId);
    ErrorResponse? UpdateUserValidation(UpdateUserDto user, int userId);
    void DeleteUser(Users user);
    void ResetUserData(Users user);
    PaginatedList<MinUserDto> GetUsersPaginated(int page);
}