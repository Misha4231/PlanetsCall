using Data.Models;
using Data.Repository.User;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.Admin;

/*
 * Controller is used as a part of admin panel to manage users (block/unblock/reset)
 */
[Route("/api/users")]
[ApiController]
public class UserManagementController(IUsersRepository usersRepository) : ControllerBase
{
    [HttpGet]
    [Cache]
    [AdminOnlyFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetAllUsers([FromQuery] int page = 1) // get paginated list of users
    {
        var u = usersRepository.GetUsersPaginated(page);
        
        return Ok(u);
    }

    [HttpGet("block/{username}/")]
    [AdminOnlyFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Block(string username)// Endpoint to block a user
    {
        return PerformAction("block", username); // Delegate the action to the shared method
    }

    [HttpGet("unblock/{username}/")] 
    [AdminOnlyFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Unblock(string username) // Endpoint to unblock a user
    {
        return PerformAction("unblock", username); // Delegate the action to the shared method
    }

    /*
     * Shared method to perform actions (block/unblock) on users.
     * This method reduces code duplication by centralizing the logic.
     */
    private IActionResult PerformAction(string action, string username)
    {
        // Try to find the user by their username
        Users? user = usersRepository.GetUserByUsername(username);
        if (user is null) // If the user is not found, return a 404 response
        {
            return NotFound($"User with username {username} does not exist.");
        }
        
        // Perform the requested action
        if (action == "block") user.IsBlocked = true;
        else if (action == "unblock") user.IsBlocked = false;

        usersRepository.UpdateUser(user);
        return Ok();
    }

    [HttpGet("reset/{username}")]
    [AdminOnlyFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Reset(string username) // reset all userdata (despite essential ones as email, username etc.)
    {
        // Try to find the user by their username
        Users? user = usersRepository.GetUserByUsername(username);
        if (user is null) // If the user is not found, return a 404 response
        {
            return NotFound($"User with username {username} does not exist.");
        }
        
        usersRepository.ResetUserData(user); // reset
        return Ok();
    }
}