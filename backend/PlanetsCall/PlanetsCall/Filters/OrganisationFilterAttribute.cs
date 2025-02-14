using Data.Context;
using Data.Models;
using Data.Repository.Community;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using PlanetsCall.Controllers.Exceptions;

namespace PlanetsCall.Filters;

public class OrganisationFilter : ActionFilterAttribute
{

    public override void OnActionExecuting(ActionExecutingContext context)
    {
<<<<<<< HEAD
        IOrganisationsRepository organisationsRepository = context.HttpContext.RequestServices.GetService(typeof(IOrganisationsRepository)) as IOrganisationsRepository;
=======
        IOrganisationsRepository? organisationsRepository = context.HttpContext.RequestServices.GetService(typeof(IOrganisationsRepository)) as IOrganisationsRepository;
>>>>>>> f86c380c28e9c6c821929ff547448e2078917dda

        var organisationName = context.RouteData.Values["organisationName"]?.ToString();
        if (string.IsNullOrEmpty(organisationName))
        {
            context.Result = new BadRequestObjectResult(
                new ErrorResponse(new List<string>() { "Organisation name is required" }, StatusCodes.Status400BadRequest, context.HttpContext.TraceIdentifier));
            return;
        }

        Organisations organisation = organisationsRepository?.GetObjOrganisation(organisationName);
        if (organisation is null)
        {
            context.Result = new NotFoundObjectResult("Organisation not found.");
            return;
        }
        
        
        context.RouteData.Values.Add("Organisation", organisation);
        //base.OnActionExecuting(context);
    }
}