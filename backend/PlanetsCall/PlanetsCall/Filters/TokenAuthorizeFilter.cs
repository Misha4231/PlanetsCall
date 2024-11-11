using System.Security.Claims;
using Data.Models;
using Data.Repository.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PlanetsCall.Filters;

public class TokenAuthorizeFilter : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        IUsersRepository usersRepository =
            context.HttpContext.RequestServices.GetService(typeof(IUsersRepository)) as IUsersRepository;
        
        if (context.HttpContext.User.Identity is ClaimsIdentity identity)
        {
            var userClaims = identity.Claims;
            var userEmail = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            
            if (string.IsNullOrEmpty(userEmail))
            {
                context.Result = new UnauthorizedObjectResult("");
                return;
            }
            Users user = usersRepository.GetUserByEmail(userEmail!);
            context.RouteData.Values.Add("requestUser", user);
            return;
        }
        
        context.Result = new UnauthorizedObjectResult("");
    }
}