using Microsoft.AspNetCore.Mvc;
using Data.Context;
using Data.DTO.User;
using Data.Models;
using Data.Repository.User;
using PlanetsCall.Controllers.Exceptions;

namespace PlanetsCall.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PlatensCallContext _context;
        private readonly IUsersRepository _usersRepository;
        public AuthController(PlatensCallContext context, IConfiguration configuration)
        {
            _context = context;
            _usersRepository = new UsersRepository(context, configuration);
        }

        [HttpPost]
        [Route("sign-up/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult SignUp([FromBody] RegisterUserDto user)
        {
            var errorMessages = user.IsValid();
            if (errorMessages.Count() != 0) return BadRequest(new ErrorResponse(errorMessages, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));

            Users newUser = new Users
            {
                Email = user.Email,
                Username = user.Username,
                Password = user.Password,
                IsActivated = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                PreferredLanguage = "en",
                Status = "online"
            };

            errorMessages = _usersRepository.UniqueUserValidation(newUser);
            if (errorMessages.Count() != 0) return BadRequest(new ErrorResponse(errorMessages, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
            
            
            Users createdUser = _usersRepository.InsertUser(newUser);
            return Ok(createdUser);
        }
    }
}
