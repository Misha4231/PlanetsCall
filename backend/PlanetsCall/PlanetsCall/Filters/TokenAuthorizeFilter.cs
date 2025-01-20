using System.Security.Claims;
using Data.Models;
using Data.Repository.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PlanetsCall.Filters;

// filter used to authorize user
public class TokenAuthorizeFilter : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        IUsersRepository? usersRepository = context.HttpContext.RequestServices.GetService(typeof(IUsersRepository)) as IUsersRepository;
        if (usersRepository is null)
        {
            context.Result = new BadRequestResult();
            return;
        }

        if (context.HttpContext.User.Identity is ClaimsIdentity identity) // read claims from token
        {
            var userClaims = identity.Claims;
            var userEmail = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value; // search for email claim
            
            if (string.IsNullOrEmpty(userEmail)) // no email -> unauthorized
            {
                context.Result = new UnauthorizedObjectResult("");
                return;
            }
            
            // get user
            Users? user = usersRepository.GetUserByEmail(userEmail!);
            if (user is null) // check if user exists
            {
                context.Result = new UnauthorizedObjectResult("Not existing user");
                return;
            }
            if (!user.IsActivated) // check if it is activated
            {
                context.Result = new UnauthorizedObjectResult("user is not activated");
                return;
            }
            if (user.IsBlocked) // check if user has been blocked
            {
                context.Result = new UnauthorizedObjectResult("user is blocked");
                return;
            }
            
            // add to route data to get it in controller method
            context.RouteData.Values.Add("requestUser", user);
            return;
        }
        
        context.Result = new UnauthorizedObjectResult("");
    }
}