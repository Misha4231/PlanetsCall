using Data.DTO.User;
using Data.Models;
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
    
    public ProfilesController(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
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
}