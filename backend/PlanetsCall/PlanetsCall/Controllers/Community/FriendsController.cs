using Data.DTO.Global;
using Data.Models;
using Data.Repository.Community;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.Community;

[Route("/api/community/[controller]")]
[ApiController]
public class FriendsController : ControllerBase
{
    private readonly IFriendsRepository _friendsRepository;

    public FriendsController(IFriendsRepository friendsRepository)
    {
        this._friendsRepository = friendsRepository;
    }

    [HttpGet]
    [Route("")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetFriends([FromQuery] string search = "", [FromQuery] int page = 1)
    {
        Console.WriteLine(search);
        if (search.Length > 200)
            return BadRequest(new ErrorResponse(new List<string>() { "Search string can't be longer than 200 symbols"  }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));

        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        
        if (string.IsNullOrWhiteSpace(search)) return Ok(_friendsRepository.GetFriends(requestUser!, page));
        
        return Ok(_friendsRepository.GetFriends(requestUser!, page, search));
    }
    
    [HttpPost]
    [Route("{username}/")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult AddFriend(string username)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        if (username == requestUser.Username) return BadRequest(new ErrorResponse(new List<string>() { "You can't add yourself to friends" }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        
        try
        {
            _friendsRepository.AddFriend(requestUser!, username);
        }
        catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }

        return Ok();
    }
    
    [HttpDelete]
    [Route("{username}/")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult RemoveFriend(string username)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        if (username == requestUser.Username) return BadRequest(new ErrorResponse(new List<string>() { "You can't remove yourself from friends" }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        
        try
        {
            _friendsRepository.DeleteFriend(requestUser!, username);
        }
        catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }

        return NoContent();
    }
}