using Data.DTO.User;
using Data.Models;
using Data.Repository.Log;
using Data.Repository.User;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.User;

/*
 * ProfilesController provides a methods to interact with user's profile
 */
[Route("/api/[controller]")]
[ApiController]
public class ProfilesController : ControllerBase
{
    private readonly IUsersRepository _usersRepository;
    private readonly ILogsRepository _logsRepository;
    
    public ProfilesController(IUsersRepository usersRepository, ILogsRepository logsRepository)
    {
        _usersRepository = usersRepository;
        _logsRepository = logsRepository;
    }

    [HttpPut]
    [TokenAuthorizeFilter]
    [Route("{userId}/set-settings/")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult SetSettings([FromBody] UpdateUserDto newUserData, int userId) // update user profile data
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users; // getting user from TokenAuthorizeFilter
        if (requestUser!.Id != userId && !requestUser.IsAdmin) // checking if user requesting is the same user as one to update or admin
        {
            return StatusCode(StatusCodes.Status403Forbidden);
        }
        
        ErrorResponse? err = _usersRepository.UpdateUserValidation(newUserData, userId); // make many validations to safely update user, returns error response or null
        if (err is not null) // if err is not null, something happen and user can't be updated
        {
            if (err.Status == StatusCodes.Status400BadRequest) return BadRequest(err);
            return StatusCode(StatusCodes.Status404NotFound);
        }
        
        //update
        Users u = _usersRepository.UpdateUser(newUserData, userId);
        return Ok(new FullUserDto(u));
    }

    [HttpDelete]
    [TokenAuthorizeFilter]
    [Route("delete-me/")]
    public IActionResult DeleteMe() // delete profile requesting
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users; // get user
        _usersRepository.DeleteUser(requestUser!); // delete
        return NoContent();
    }

    [HttpGet]
    [TokenAuthorizeFilter]
    [Route("add-attendance/")]
    public IActionResult SetAttendance() // checks user's attendance on this day
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;

        _logsRepository.AddAttendance(requestUser!); 
        return Ok();
    }
    
    [HttpGet]
    [TokenAuthorizeFilter]
    [Route("{username}/attendance/")]
    public IActionResult GetAttendance(string username) // get when user attend service
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        Users? user = _usersRepository.GetUserByUsername(username); // data is available to everybody if profile is visible
        if (user == null) // if user not found - 404
        {
            return BadRequest(new ErrorResponse(new List<string> { "user is not exists" },
                StatusCodes.Status404NotFound, HttpContext.TraceIdentifier));
        }
        // check if data is accessible
        if (!user!.IsVisible && !requestUser!.IsAdmin && requestUser.Username != username) return StatusCode(StatusCodes.Status403Forbidden);

        List<Logs> attendance = _logsRepository.GetAttendance(user); // get results
        return Ok(attendance);
    }

    [HttpGet]
    [Route("{username}/")]
    public IActionResult GetUserProfile(string username) // get profile data to display profile
    {
        Users? user = _usersRepository.GetUserByUsername(username);
        if (user == null) // if user not found - 404
        {
            return BadRequest(new ErrorResponse(new List<string> { "user is not exists" },
                StatusCodes.Status404NotFound, HttpContext.TraceIdentifier));
        }
        
        return Ok(new DisplayUserDto(user));
    }

    [HttpGet]
    [Route("search/{searchString}/")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult SearchUser(string searchString, [FromQuery] int page = 1) // returns paginated list for full-text search
    {
        // validate search string length
        if (searchString.Length > 200) return BadRequest(new ErrorResponse(new List<string> { "Search string can't be longer than 200 symbols" }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));

        var users = _usersRepository.SearchUsers(searchString, page);
        return Ok(users);
    }
}