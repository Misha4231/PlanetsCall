using Data.DTO.Global;
using Data.Models;
using Data.Repository.Community;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.Community;

// friends CRUD
[Route("/api/community/[controller]")]
[ApiController]
public class FriendsController(IFriendsRepository friendsRepository) : ControllerBase
{
    [HttpGet]
    [Route("")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetFriends([FromQuery] string search = "", [FromQuery] int page = 1)// returns paginated list for full-text search
    {
        if (search.Length > 200) // validate search string length
            return BadRequest(new ErrorResponse(new List<string>() { "Search string can't be longer than 200 symbols"  }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));

        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        
        return Ok(friendsRepository.GetFriends(requestUser!, page, search));
    }
    
    [HttpPost]
    [Route("{username}/")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult AddFriend(string username)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        // validate if user want to add himself to friends list
        if (username == requestUser!.Username) return BadRequest(new ErrorResponse(new List<string>() { "You can't add yourself to friends" }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        
        int code = friendsRepository.AddFriend(requestUser!, username); //add
        return StatusCode(code);
    }
    
    [HttpDelete]
    [Route("{username}/")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult RemoveFriend(string username)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        // validate if user want to remove himself from the friends list
        if (username == requestUser!.Username) return BadRequest(new ErrorResponse(new List<string>() { "You can't remove yourself from friends" }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        
        int code = friendsRepository.DeleteFriend(requestUser!, username); //remove
        return StatusCode(code);
    }
}