using Data.DTO.User;
using Data.Models;
using Data.Repository.Log;
using Data.Repository.User;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.User;

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
    [Route("set-settings/")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult SetSettings([FromBody] UpdateUserDto userToUpdate)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        if (requestUser!.Id != userToUpdate.Id && !requestUser.IsAdmin)
        {
            return StatusCode(StatusCodes.Status403Forbidden);
        }

        List<string> msg = _usersRepository.UpdateUserValidation(userToUpdate);
        if (msg.Count != 0)
        {
            return BadRequest(new ErrorResponse(msg, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }
        
        //update
        _usersRepository.UpdateUser(userToUpdate); 
        return Ok(new FullUserDto(_usersRepository.GetFullUserById(userToUpdate.Id)!));
    }

    [HttpDelete]
    [TokenAuthorizeFilter]
    [Route("delete-me/")]
    public IActionResult DeleteMe()
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        _usersRepository.DeleteUser(requestUser!);
        return NoContent();
    }

    [HttpGet]
    [TokenAuthorizeFilter]
    [Route("add-attendance/")]
    public IActionResult SetAttendance()
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;

        _logsRepository.AddAttendance(requestUser!);
        return Ok();
    }
    
    [HttpGet]
    [TokenAuthorizeFilter]
    [Route("{username}/attendance/")]
    public IActionResult GetAttendance(string username)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        if (!requestUser!.IsVisible && !requestUser.IsAdmin && requestUser.Username != username) return StatusCode(StatusCodes.Status403Forbidden);

        Users user = _usersRepository.GetUserByUsername(username);
        if (user == null)
        {
            return BadRequest(new ErrorResponse(new List<string> { "user is not exists" },
                StatusCodes.Status404NotFound, HttpContext.TraceIdentifier));
        }
        List<Logs> attendance = _logsRepository.GetAttendance(user);
        return Ok(attendance);
    }
}