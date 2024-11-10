using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Core.User;
using Microsoft.AspNetCore.Mvc;
using Data.Context;
using Data.DTO.User;
using Data.Models;
using Data.Repository.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Filters;
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
        private readonly JwtTokenManager _jwtTokenManager;
        public AuthController(PlatensCallContext context, IConfiguration configuration, IUsersRepository usersRepository, EmailSender emailSender, HashManager hashManager, JwtTokenManager jwtTokenManager)
        {
            _context = context;
            _usersRepository = usersRepository;
            _configuration = configuration;
            _emailSender = emailSender;
            _hashManager = hashManager;
            _jwtTokenManager = jwtTokenManager;
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
            this._emailSender.SendUserConfirmationMail(createdUser);
            
            return Ok(createdUser);
        }

        [HttpPost]
        [Route("activate/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult ActivateProfile([FromBody] DisposableCodeDto activationCodeDto)
        {
            List<string> errorMessages = new List<string>();
            var userData = this._hashManager.Decrypt(activationCodeDto.Code).Split(':');
            
            if (!long.TryParse(userData[1], out var timestamp))
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

            var user = _usersRepository.GetUserByUsername(userData[0]);
            if (user is null)
            {
                errorMessages.Add("Not existing user");
            }
            if (errorMessages.Count() != 0) return BadRequest(new ErrorResponse(errorMessages, StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));

            user!.IsActivated = true;
            user!.IsVisible = true;
            _usersRepository.UpdateUser(user!);

            var token = _jwtTokenManager.GenerateToken(user);
            return Ok(new AccessTokenDto() { AccessToken = token });
        }

        [HttpPost]
        [Route("sign-in/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult SignIn([FromBody] SignInUserDto user)
        {
            #nullable enable
            
            Users? foundUser = null;
            foundUser = _usersRepository.GetUserByUsername(user.UniqueIdentifier) ?? _usersRepository.GetUserByEmail(user.UniqueIdentifier);
            
            if (foundUser is null)
            {
                return Unauthorized(new ErrorResponse(new List<string>(){"Invalid email or username"}, StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));
            }
            if (string.IsNullOrEmpty(foundUser.Password))
            {
                return Unauthorized(new ErrorResponse(new List<string>(){"Your account was registered via google"}, StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));
            }
            if (user.Password != _hashManager.Decrypt(foundUser.Password))
            {
                return Unauthorized(new ErrorResponse(new List<string>(){"Wrong password"}, StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));
            }
            #nullable disable

            foundUser.LastLogin = DateTime.Now;
            _usersRepository.UpdateUser(foundUser);
            
            var token = _jwtTokenManager.GenerateToken(foundUser);
            return Ok(new AccessTokenDto() { AccessToken = token });
        }

        [HttpPost]
        [Route("forgot-password/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ForgotPassword([FromBody] UserIdentifierDto userIdentifier)
        {
            #nullable enable
            
            Users? foundUser = null;
            foundUser = _usersRepository.GetUserByUsername(userIdentifier.UniqueIdentifier) ?? _usersRepository.GetUserByEmail(userIdentifier.UniqueIdentifier);
            if (foundUser is null)
            {
                return Unauthorized(new ErrorResponse(new List<string>(){"Invalid email or username"}, StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));
            }
            if (string.IsNullOrEmpty(foundUser.Password))
            {
                return Unauthorized(new ErrorResponse(new List<string>(){"Your account was registered via google"}, StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));
            }
            #nullable disable

            _emailSender.SendForgottenPasswordMail(foundUser);
            return Ok();
        }
        
        /*[HttpPost]
        [Route("forgot-password/change")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]*/
        
        [HttpGet]
        [Route("me/full/")]
        [TokenAuthorizeFilter]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetMeFull()
        {
            Users user = HttpContext.GetRouteValue("requestUser") as Users;
            return Ok(new FullUserDto(user!));
        }
        
        [HttpGet]
        [Route("me/min/")]
        [TokenAuthorizeFilter]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetMeMin()
        {
            Users user = HttpContext.GetRouteValue("requestUser") as Users;
            return Ok(new MinUserDto(user!));
        }
    }
}
