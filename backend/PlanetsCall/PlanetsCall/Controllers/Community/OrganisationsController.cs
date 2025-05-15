using Core.Exceptions;
using Data.DTO.Community;
using Data.DTO.Global;
using Data.Models;
using Data.Repository.Community;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.Community;

[ApiController]
[Route("/api/community/[controller]")]
public class OrganisationsController(IOrganisationsRepository organisationsRepository, IVerificationRepository verificationRepository) : ControllerBase
{
    [HttpGet]
    [UserCache]
    [Route("my/")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult MyOrganisations([FromQuery] int page = 1) // get organisations assigned to user
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        PaginatedList<MinOrganisationDto> o = organisationsRepository.GetUserOrganisations(requestUser!, page);
        
        return Ok(o);
    }

    [HttpGet]
    [Route("join/{organisationUniqueName}/")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult JoinOrganisation(string organisationUniqueName) // join organisation of specified name
    {
        Users? user = HttpContext.GetRouteValue("requestUser") as Users;
        Organisations? organisation;
        try
        {
            organisation = organisationsRepository.GetObjOrganisation(organisationUniqueName); // get organisation for validation
        }
        catch (CodeException)
        {
            return NotFound();
        }

        // Validation checks to ensure the user meets the criteria for joining the organization.
        List<string> errorMessages = new List<string>();
        if (user != null && organisation.MinimumJoinLevel > user.Progress) 
        {
            errorMessages.Add("User does not have enough level");  // Check if the user's level meets the minimum requirement.
        }
        if (organisation.Members is { Count: >= 50 }) // Validate the maximum member limit.
        {
            errorMessages.Add("Organisation can't have more than 50 members"); 
        }
        if (organisation.Members != null && user != null && organisation.Members.Contains(user))  // Check if the user is already a member.
        {
            errorMessages.Add("User is already a member"); 
        }
        if (organisation.Requests != null && user != null && organisation.Requests.Contains(user) && organisation.IsPrivate) // Check if a prior request exists for a private organization.
        {
            errorMessages.Add("User has sent request previously");
        }
        if (errorMessages.Count() != 0)  // Return a 400 Bad Request if there are validation errors.
            return BadRequest(new ErrorResponse(errorMessages, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));

        // Proceed to join the organization.
        organisationsRepository.JoinOrganization(user!, organisationUniqueName);

        return Ok();
    }

    [HttpPost]
    [Route("")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult CreateOrganisation([FromBody] OrganisationFormDto organisationDto) // Creates a new organization based on the provided data.
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;

        try
        {
            // Delegate the organization creation to the repository and return the created organization.
            FullOrganisationDto newOrganisation = organisationsRepository.CreateOrganisation(requestUser!, organisationDto);
            return Ok(newOrganisation);
        } catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }
    }

    [HttpGet]
    [UserCache]
    [Route("{organisationUniqueName}/requests/")]
    [TokenAuthorizeFilter]
    public IActionResult GetOrganisationJoinRequests(string organisationUniqueName) // Retrieves a list of user join requests for a specified organization.
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users; 
        try
        {
            // Delegate the retrieval of join requests to the repository.
            var reqUsers =organisationsRepository.GetRequests(requestUser!, organisationUniqueName);

            return Ok(reqUsers);
        } catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }
    }

    [HttpPost]
    [Route("{organisationUniqueName}/requests/{userId}")]
    [TokenAuthorizeFilter]
    public IActionResult AcceptJoinRequests(string organisationUniqueName, int userId) // Accepts a user's join request for a specified organization.
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        try
        {
            organisationsRepository.AcceptRequest(requestUser!, organisationUniqueName, userId);
        } catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }
        return Ok();
    }
    [HttpDelete]
    [Route("{organisationUniqueName}/requests/{userId}")]
    [TokenAuthorizeFilter]
    public IActionResult RejectJoinRequests(string organisationUniqueName, int userId)// Rejects a user's join request for a specified organization.
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        try
        {
            organisationsRepository.RejectRequest(requestUser!, organisationUniqueName, userId);
        } catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }
        return Ok();
    }

    [HttpGet]
    [Cache]
    [Route("{organisationUniqueName}/users/")]
    public IActionResult GetMembers(string organisationUniqueName)
    {
        try
        {
            return Ok(organisationsRepository.GetMembers(organisationUniqueName));
        } catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }
    }

    [HttpDelete]
    [Route("{organisationUniqueName}/users/{userId}/")]
    [TokenAuthorizeFilter]
    public IActionResult RemoveMember(string organisationUniqueName, int userId)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        try
        {
            organisationsRepository.RemoveMember(requestUser!, organisationUniqueName, userId);
        } catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }
        return NoContent();
    }

    [HttpGet]
    [Cache]
    [Route("search/{searchPhrase}/")]
    public IActionResult SearchByPhrase(string searchPhrase, [FromQuery] int page = 1)
    {
        var o = organisationsRepository.SearchOrganization(searchPhrase, page);
        
        return Ok(o);
    }

    [HttpGet]
    [Cache]
    [Route("settings/{organisationUniqueName}/")]
    public IActionResult GetSettings(string organisationUniqueName)
    {
        try
        {
            return Ok(organisationsRepository.GetOrganisation(organisationUniqueName));
        } catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }
    }
    [HttpPut]
    [Route("settings/{organisationUniqueName}/")]
    [TokenAuthorizeFilter]
    public IActionResult UpdateSettings(OrganisationUpdateFormDto newOrganisationData)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        
        try
        {
            if (requestUser != null)
                return Ok(organisationsRepository.UpdateOrganisation(newOrganisationData, requestUser));
        } catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }

        return BadRequest();
    }
    
    [HttpDelete]
    [Route("{organisationUniqueName}/")]
    [TokenAuthorizeFilter]
    public IActionResult DeleteOrganisation(string organisationUniqueName)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        
        try
        {
            // check if organisation has unresolved verification request
            Organisations organisation = organisationsRepository.GetObjOrganisation(organisationUniqueName);
            if (organisation.VerificationRequest != null)
                verificationRepository.DeleteRequest(organisation.VerificationRequest);

            // remove organisation
            if (requestUser != null) organisationsRepository.RemoveOrganisation(organisationUniqueName, requestUser);

            return Ok();
        } catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }
    }

    [HttpPost]
    [Route("{organisationUniqueName}/request-verification/")]
    [TokenAuthorizeFilter]
    public IActionResult RequestVerification(string organisationUniqueName, [FromBody] string description) // requests a verification of the organisation
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        
        try
        {
            if (requestUser != null)
                organisationsRepository.AddVerificationRequest(organisationUniqueName, requestUser, description);
            return Ok();
        } catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }
    }
}