using Core.User;
using Microsoft.AspNetCore.Mvc;
using Data.DTO.User;
using Data.Models;
using Data.Repository.User;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Filters;
using PlanetsCall.Helper;


namespace PlanetsCall.Controllers.User
{ /*
 * Auth Controller gives us all the necessary methods for authentication and authorization
 * also it provides the most important functionality for working with profiles (password changing, getting profile data)
 */
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository; // used everywhere through class for CRUD operations in database and partly for data validation
        private readonly EmailSender _emailSender; // helper service to easily send confirmation emails
        private readonly HashManager _hashManager; // mainly used for hashing password
        private readonly JwtTokenManager _jwtTokenManager; // generates tokens to later put them in Authorization header
        private readonly IWebHostEnvironment _webHostEnvironment; // used to make development only method
        public AuthController(IUsersRepository usersRepository, EmailSender emailSender, HashManager hashManager, JwtTokenManager jwtTokenManager, IWebHostEnvironment webHostEnvironment) // Dependency Injection
        {
            // constructor assigns all helper services
            _usersRepository = usersRepository;
            _emailSender = emailSender;
            _hashManager = hashManager;
            _jwtTokenManager = jwtTokenManager;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost]
        [Route("sign-up/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult SignUp([FromBody] RegisterUserDto user)
        {
            // when lots of sensitive data provided, exceptions could contain many messages, so List is being used
            List<string> errorMessages = user.IsValid();
            if (errorMessages.Count() != 0) return BadRequest(new ErrorResponse(errorMessages, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));

            Users newUser = new Users
            {
                Email = user.Email,
                Username = user.Username,
                Password = user.Passwords?.Password,
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
            
            return Ok(new FullUserDto(createdUser));
        }
        
        #if DEBUG // restrict access to debug only
        [HttpPost]
        [Route("development-sign-up/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ImidiateSignUp([FromBody] RegisterUserDto user)
        {
            // when lots of sensitive data provided, exceptions could contain many messages, so List is being used
            List<string> errorMessages = user.IsValid();
            if (errorMessages.Count() != 0) return BadRequest(new ErrorResponse(errorMessages, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));

            Users newUser = new Users
            {
                Email = user.Email,
                Username = user.Username,
                Password = user.Passwords?.Password,
                IsActivated = true,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                PreferredLanguage = "en",
                Status = "online"
            };

            errorMessages = _usersRepository.UniqueUserValidation(newUser);
            if (errorMessages.Count() != 0) return BadRequest(new ErrorResponse(errorMessages, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
            
            Users createdUser = _usersRepository.InsertUser(newUser);
            var token = _jwtTokenManager.GenerateToken(createdUser);
            return Ok(new AccessTokenDto() { AccessToken = token });
        }
#endif

        [HttpPost]
        [Route("activate/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult ActivateProfile([FromBody] DisposableCodeDto activationCodeDto)
        {
            ConfirmationCodeValidationResponse codeValidationResponse = ValidateConfirmationCode(activationCodeDto.Code);
            if (codeValidationResponse.ErrorMessages.Count() != 0) return BadRequest(new ErrorResponse(codeValidationResponse.ErrorMessages, StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));

            codeValidationResponse.FoundUser!.IsActivated = true;
            codeValidationResponse.FoundUser!.IsVisible = true;
            _usersRepository.UpdateUser(codeValidationResponse.FoundUser!, "activation");

            var token = _jwtTokenManager.GenerateToken(codeValidationResponse.FoundUser);
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
            _usersRepository.UpdateUser(foundUser, "sign in");
            
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

        [HttpPost]
        [Route("forgot-password/change")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ChangeForgottenPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            ConfirmationCodeValidationResponse codeValidationResponse = ValidateConfirmationCode(forgotPasswordDto.Code);
            if (codeValidationResponse.ErrorMessages.Count() != 0) return BadRequest(new ErrorResponse(codeValidationResponse.ErrorMessages, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
            List<string> passwordMistakes = forgotPasswordDto.Passwords.IsValid();
            if (passwordMistakes.Count() != 0) return BadRequest(new ErrorResponse(passwordMistakes, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));

            codeValidationResponse.FoundUser!.Password = _hashManager.Encrypt(forgotPasswordDto.Passwords.Password!);
            _usersRepository.UpdateUser(codeValidationResponse.FoundUser, "change password");
            
            return Ok();
        }
        
        [HttpGet]
        [Route("me/full/")]
        [TokenAuthorizeFilter]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetMeFull()
        {
            Users user = HttpContext.GetRouteValue("requestUser") as Users;
            return Ok(new FullUserDto(_usersRepository.GetFullUserById(user!.Id)!));
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

        private ConfirmationCodeValidationResponse ValidateConfirmationCode(string code)
        {
            List<string> errorMessages = new List<string>();
            var decodedCode = _hashManager.Decrypt(code);
            if (string.IsNullOrEmpty(decodedCode))
            {
                errorMessages.Add("Not valid code");
                return new ConfirmationCodeValidationResponse(errorMessages, null);
            }
            
            var userData = decodedCode.Split(':');
            
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

            return new ConfirmationCodeValidationResponse(errorMessages, user);
        }
    }

    public class ConfirmationCodeValidationResponse
    {
#nullable enable
        public ConfirmationCodeValidationResponse(List<string> errMsg, Users? user)
        {
            ErrorMessages = errMsg;
            FoundUser = user;
        }
        public List<string> ErrorMessages { get; set; }
        
        public Users? FoundUser { get; set; }
       
    }
#nullable disable
}
