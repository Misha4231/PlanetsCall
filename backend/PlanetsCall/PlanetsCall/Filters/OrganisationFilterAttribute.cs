using Core.Exceptions;
using Data.Models;
using Data.Repository.Community;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PlanetsCall.Filters;

public class OrganisationFilter : ActionFilterAttribute
{

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        IOrganisationsRepository? organisationsRepository = context.HttpContext.RequestServices.GetService(typeof(IOrganisationsRepository)) as IOrganisationsRepository;

        var organisationName = context.RouteData.Values["organisationName"]?.ToString();
        if (string.IsNullOrEmpty(organisationName))
        {
            context.Result = new BadRequestObjectResult(
                new ErrorResponse(["Organisation name is required"], StatusCodes.Status400BadRequest, context.HttpContext.TraceIdentifier));
            return;
        }

        Organisations? organisation;
        try
        {
            organisation = organisationsRepository?.GetObjOrganisation(organisationName);
        }
        catch (CodeException e)
        {
            context.Result = new NotFoundObjectResult(e.Message);
            return;
        }
        
        if (organisation is null)
        {
            context.Result = new NotFoundObjectResult("Organisation not found.");
            return;
        }
        
        
        context.RouteData.Values.Add("Organisation", organisation);
    }
}