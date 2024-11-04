using Core.User;
using Microsoft.AspNetCore.Mvc;
using Data.Context;
using Data.DTO.User;
using Data.Models;
using Data.Repository.User;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Helper;

namespace PlanetsCall.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PlatensCallContext _context;
        private readonly IUsersRepository _usersRepository;
        private readonly IConfiguration _configuration;
        private readonly EmailSender _emailSender;
        private readonly HashManager _hashManager;
        public AuthController(PlatensCallContext context, IConfiguration configuration, IUsersRepository usersRepository, EmailSender emailSender, HashManager hashManager)
        {
            _context = context;
            _usersRepository = usersRepository;
            _configuration = configuration;
            this._emailSender = emailSender;
            this._hashManager = hashManager;
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
            this._emailSender.SendUserConfirmationEmail(createdUser);
            
            return Ok(createdUser);
        }

        [HttpPost]
        [Route("activate/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ActivateProfile([FromBody] string activationCode)
        {
            List<string> errorMessages = new List<string>();
            var userData = this._hashManager.Decrypt(activationCode).Split(':');
            long timestamp;
            if (!long.TryParse(userData[1], out timestamp))
            {
                errorMessages.Add("No timestamp in activation code");
            }
            else
            {
                if (DateTimeOffset.UtcNow.ToUnixTimeSeconds() - timestamp > 86400)
                {
                    errorMessages.Add("Activation code has expired");
                }
            }

            Users? user = _usersRepository.GetUserByUsername(userData[0]);
            if (user is null)
            {
                errorMessages.Add("Not existing user");
            }
            if (errorMessages.Count() != 0) return BadRequest(new ErrorResponse(errorMessages, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));

            //TODO return jwtToken
            return Ok();
        }
    }
}
