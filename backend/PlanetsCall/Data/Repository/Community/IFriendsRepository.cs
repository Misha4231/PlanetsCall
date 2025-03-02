using Data.DTO.Global;
using Data.DTO.User;
using Data.Models;
using Microsoft.AspNetCore.Mvc;

namespace Data.Repository.Community;

public interface IFriendsRepository
{
    PaginatedList<MinUserDto> GetFriends(Users? user, int page, string? searchString);
    int AddFriend(Users user, string newFriendUsername);
    int DeleteFriend(Users user, string friendUsername);
}