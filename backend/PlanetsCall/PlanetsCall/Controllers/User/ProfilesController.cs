using Data.DTO.User;
using Data.Models;
using Data.Repository.User;
using Microsoft.AspNetCore.Mvc;
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
    public IActionResult SetSettings([FromBody] UpdateUserDto userToUpdate)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        if (requestUser!.Id != userToUpdate.Id && !requestUser.IsAdmin)
        {
            return StatusCode(StatusCodes.Status403Forbidden);
        }
        
        //update

        return Ok("qwe");
    }
}