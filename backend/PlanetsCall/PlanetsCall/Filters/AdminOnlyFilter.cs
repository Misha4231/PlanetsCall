using System.Security.Claims;
using Data.Models;
using Data.Repository.User;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PlanetsCall.Filters;

// AdminOnlyFilter is similar to TokenAuthorizeFilter, but checks if user has admin role
public class AdminOnlyFilter : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // try to get user repository
        IUsersRepository? usersRepository =
            context.HttpContext.RequestServices.GetService(typeof(IUsersRepository)) as IUsersRepository;
        if (usersRepository is null)
        {
            context.Result = new BadRequestResult();
            return;
        }
        
        if (context.HttpContext.User.Identity is ClaimsIdentity identity) // read claims from token
        {
            var userClaims = identity.Claims;
            var userEmail = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;  // search for email claim
            
            if (string.IsNullOrEmpty(userEmail))  // no email -> unauthorized
            {
                context.Result = new UnauthorizedObjectResult("");
                return;
            }
            
            // get user and check if IsAdmin property is true
            Users? user = usersRepository.GetUserByEmail(userEmail!);
            if (user is not null && !user.IsAdmin)
            {
                context.Result = new ForbidResult();
                return;
            }
            
            // add to route data to get it in controller method
            context.RouteData.Values.Add("requestUser", user);
            return;
        }
        
        context.Result = new UnauthorizedObjectResult("");
    }
}