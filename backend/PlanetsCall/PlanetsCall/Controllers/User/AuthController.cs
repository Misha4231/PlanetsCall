using Core.Exceptions;
using Core.User;
using Microsoft.AspNetCore.Mvc;
using Data.DTO.User;
using Data.Models;
using Data.Repository.User;
using PlanetsCall.Filters;
using PlanetsCall.Helper;


namespace PlanetsCall.Controllers.User
{ /*
 * Auth Controller gives us all the necessary methods for authentication and authorization
 * also it provides the most important functionality for working with profiles (password changing, getting profile data)
 */
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(
        IUsersRepository usersRepository,
        EmailSender emailSender,
        HashManager hashManager,
        JwtTokenManager jwtTokenManager)
        : ControllerBase
    {
        // used everywhere through class for CRUD operations in database and partly for data validation
        // helper service to easily send confirmation emails
        // mainly used for hashing password
        // generates tokens to later put them in Authorization header


        [HttpPost]
        [Route("sign-up/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult SignUp([FromBody] RegisterUserDto user)
        {
            List<string> errorMessages = new List<string>();
            Users? createdUser = ValidateAndPrepareUser(user, false, errorMessages); // validate user
            if (createdUser is null) return BadRequest(new ErrorResponse(errorMessages, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier)); // is mistakes are found return code 400
            
            emailSender.SendUserConfirmationMail(createdUser); // send mail with link to activate account
            
            return Ok(new FullUserDto(createdUser)); // return full created user
        }
        
    #if DEBUG // restrict access to debug only
        [HttpPost]
        [Route("development-sign-up/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ImmediateSignUp([FromBody] RegisterUserDto user) // register user for testing purposes without activation needed
        {
            List<string> errorMessages = new List<string>();
            Users? createdUser = ValidateAndPrepareUser(user, true, errorMessages); // validate user
            if (createdUser is null) return BadRequest(new ErrorResponse(errorMessages, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier)); // is mistakes are found return code 400

            var token = jwtTokenManager.GenerateToken(createdUser); // generate token to later add it to Authorization header
            return Ok(new AccessTokenDto() { AccessToken = token }); // return token
        }
    #endif

        // helper method to remove code repetition from SignUp and ImmediateSignUp methods
        private Users? ValidateAndPrepareUser(RegisterUserDto user, bool isActivated, List<string> errorMessages /* when lots of sensitive data provided, exceptions could contain many messages, so List is being used*/)
        {
            errorMessages.AddRange(user.IsValid());
            // checks if new user data is unique
            if (usersRepository.GetUserByEmail(user.Email) is not null) errorMessages.Add("User with the same email already exists");
            if (usersRepository.GetUserByUsername(user.Username) is not null) errorMessages.Add("User with the same username already exists");
            
            // if mistakes in data from user is found, return null
            if (errorMessages.Count() != 0) return null; 

            // only after user data validation construct one and add to database
            var newUser = new Users
            {
                Email = user.Email,
                Username = user.Username,
                Password = user.Passwords?.Password,
                IsActivated = isActivated,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                PreferredLanguage = "en",
                Status = ""
            };
            
            Users? createdUser = usersRepository.InsertUser(newUser); // add to database
            return createdUser;
        }

        
        // activate user's profile
        [HttpPost]
        [Route("activate/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult ActivateProfile([FromBody] DisposableCodeDto activationCodeDto) // input is code that user get inside link to mail when register
        {
            ConfirmationCodeValidationResponse codeValidationResponse = ValidateConfirmationCode(activationCodeDto.Code); // validate code and get user
            if (codeValidationResponse.ErrorMessages.Count() != 0) return BadRequest(new ErrorResponse(codeValidationResponse.ErrorMessages, StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));

            // update user to make it available to use
            codeValidationResponse.FoundUser!.IsActivated = true;
            codeValidationResponse.FoundUser!.IsVisible = true;
            usersRepository.UpdateUser(codeValidationResponse.FoundUser!); // update user data in database

            // return authorization token
            var token = jwtTokenManager.GenerateToken(codeValidationResponse.FoundUser);
            return Ok(new AccessTokenDto() { AccessToken = token });
        }

        [HttpPost]
        [Route("sign-in/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult SignIn([FromBody] SignInUserDto user) // sign in to profile
        {
            // get user by username or email (both allowed)
            Users? foundUser = usersRepository.GetUserByUsername(user.UniqueIdentifier) ?? usersRepository.GetUserByEmail(user.UniqueIdentifier);

            // validate user credentials
            if (foundUser is null)
            {
                return Unauthorized(new ErrorResponse(["Invalid email or username"], StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));
            }
            if (string.IsNullOrEmpty(foundUser.Password))
            {
                return Unauthorized(new ErrorResponse(["Your account was registered via google"], StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));
            }
            if (user.Password != hashManager.Decrypt(foundUser.Password))
            {
                return Unauthorized(new ErrorResponse(["Wrong password"], StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));
            }

            // update when last signed in
            foundUser.LastLogin = DateTime.Now;
            usersRepository.UpdateUser(foundUser);
            
            // return authorization token
            var token = jwtTokenManager.GenerateToken(foundUser);
            return Ok(new AccessTokenDto() { AccessToken = token });
        }

        [HttpPost]
        [Route("forgot-password/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ForgotPassword([FromBody] UserIdentifierDto userIdentifier) // get mail to reset password
        {
            // get user by username or email (both allowed)
            Users? foundUser = usersRepository.GetUserByUsername(userIdentifier.UniqueIdentifier) ?? usersRepository.GetUserByEmail(userIdentifier.UniqueIdentifier);

            if (foundUser is null)
            {
                return Unauthorized(new ErrorResponse(["Invalid email or username"], StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));
            }
            if (string.IsNullOrEmpty(foundUser.Password))
            {
                return Unauthorized(new ErrorResponse(["Your account was registered via google"], StatusCodes.Status401Unauthorized, HttpContext.TraceIdentifier));
            }
    
            // send mail with link
            emailSender.SendForgottenPasswordMail(foundUser);
            return Ok();
        }

        [HttpPost]
        [Route("forgot-password/change")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ChangeForgottenPassword([FromBody] ForgotPasswordDto forgotPasswordDto) // actually change password with code
        {
            // validate code provided
            ConfirmationCodeValidationResponse codeValidationResponse = ValidateConfirmationCode(forgotPasswordDto.Code);
            if (codeValidationResponse.ErrorMessages.Count() != 0) return BadRequest(new ErrorResponse(codeValidationResponse.ErrorMessages, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
            // checks if password is valid
            List<string> passwordMistakes = forgotPasswordDto.Passwords.IsValid();
            if (passwordMistakes.Count() != 0) return BadRequest(new ErrorResponse(passwordMistakes, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));

            // assign new encrypted password and update
            codeValidationResponse.FoundUser!.Password = hashManager.Encrypt(forgotPasswordDto.Passwords.Password!);
            usersRepository.UpdateUser(codeValidationResponse.FoundUser);
            
            return Ok();
        }
        
        [HttpGet]
        [UserCache]
        [Route("me/full/")]
        [TokenAuthorizeFilter]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetMeFull() // get full user data (for example to display profile)
        {
            Users? user = HttpContext.GetRouteValue("requestUser") as Users;
            return Ok(new FullUserDto(usersRepository.GetFullUserById(user!.Id)!));
        }
        
        [HttpGet]
        [UserCache]
        [Route("me/min/")]
        [TokenAuthorizeFilter]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetMeMin() // get minimum user data
        {
            Users? user = HttpContext.GetRouteValue("requestUser") as Users;
            return Ok(new MinUserDto(user!));
        }

        private ConfirmationCodeValidationResponse ValidateConfirmationCode(string code) // validates activation/confirmation code user got on email
        {
            List<string> errorMessages = new List<string>();
            var decodedCode = hashManager.Decrypt(code); // code decrypted
            if (string.IsNullOrEmpty(decodedCode))
            {
                errorMessages.Add("Not valid code");
                return new ConfirmationCodeValidationResponse(errorMessages, null);
            }
            
            string?[] userData = decodedCode.Split(':'); // code stored like that  "{username}:{timestamp}"
            
            // check if code hasn't expired
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
            // get user
            var user = usersRepository.GetUserByUsername(userData[0]);
            if (user is null)
            {
                errorMessages.Add("Not existing user");
            }
    
            return new ConfirmationCodeValidationResponse(errorMessages, user);
        }
    }

    // class uses to represent answer from ValidateConfirmationCode and easily have access to both messages and user
    public class ConfirmationCodeValidationResponse(List<string> errMsg, Users? user)
    {
        public List<string> ErrorMessages { get; set; } = errMsg;

        public Users? FoundUser { get; set; } = user;
    }
}
