using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;

namespace Data.Repository.Community;

public interface IFriendsRepository
{
    PaginatedList<MinUserDto> GetFriends(Users user, int page);
    PaginatedList<MinUserDto> GetFriends(Users user, int page, string searchString);
    void AddFriend(Users user, string newFriendUsername);
    void DeleteFriend(Users user, string friendUsername);
}