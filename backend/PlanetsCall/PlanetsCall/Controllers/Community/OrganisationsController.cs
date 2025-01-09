using Data.DTO.Community;
using Data.DTO.Global;
using Data.Models;
using Data.Repository.Community;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.Community;

[ApiController]
[Route("/api/community/[controller]")]
public class OrganisationsController : ControllerBase
{
    private readonly IOrganisationsRepository _organisationsRepository;
    public OrganisationsController(IOrganisationsRepository organisationsRepository)
    {
        this._organisationsRepository = organisationsRepository;
    }

    [HttpGet]
    [Route("my/")]
    [TokenAuthorizeFilter]
    public IActionResult MyOrganisations([FromQuery] int page = 1)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        PaginatedList<MinOrganisationDto> o = _organisationsRepository.GetUserOrganisations(requestUser!, page);
        
        return Ok(o);
    }

    [HttpGet]
    [Route("join/{organisationUniqueName}/")]
    [TokenAuthorizeFilter]
    public IActionResult JoinOrganisation(string organisationUniqueName)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;

        try
        {
            _organisationsRepository.JoinOrganization(requestUser!, organisationUniqueName);
        }
        catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }

        return Ok();
    }

    [HttpPost]
    [Route("")]
    [TokenAuthorizeFilter]
    public IActionResult CreateOrganisation([FromBody] OrganisationFormDto organisationDto)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;

        try
        {
            FullOrganisationDto newOrganisation = _organisationsRepository.CreateOrganisation(requestUser!, organisationDto);
            return Ok(newOrganisation);
        } catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }
    }

    [HttpGet]
    [Route("{organisationUniqueName}/requests/")]
    [TokenAuthorizeFilter]
    public IActionResult GetOrganisationJoinRequests(string organisationUniqueName)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        try
        {
            var reqUsers =_organisationsRepository.GetRequests(requestUser!, organisationUniqueName);

            return Ok(reqUsers);
        } catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }
    }

    [HttpPost]
    [Route("{organisationUniqueName}/requests/{userId}")]
    [TokenAuthorizeFilter]
    public IActionResult AcceptJoinRequests(string organisationUniqueName, int userId)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        try
        {
            _organisationsRepository.AcceptRequest(requestUser!, organisationUniqueName, userId);
        } catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }
        return Ok();
    }
    [HttpDelete]
    [Route("{organisationUniqueName}/requests/{userId}")]
    [TokenAuthorizeFilter]
    public IActionResult RejectJoinRequests(string organisationUniqueName, int userId)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        try
        {
            _organisationsRepository.RejectRequest(requestUser!, organisationUniqueName, userId);
        } catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }
        return Ok();
    }

    [HttpGet]
    [Route("{organisationUniqueName}/users/")]
    public IActionResult GetMembers(string organisationUniqueName)
    {
        try
        {
            return Ok(_organisationsRepository.GetMembers(organisationUniqueName));
        } catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }
    }

    [HttpDelete]
    [Route("{organisationUniqueName}/users/{userId}/")]
    [TokenAuthorizeFilter]
    public IActionResult RemoveMember(string organisationUniqueName, int userId)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        try
        {
            _organisationsRepository.RemoveMember(requestUser!, organisationUniqueName, userId);
        } catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }
        return NoContent();
    }

    [HttpGet]
    [Route("search/{searchPhrase}/")]
    public IActionResult SearchByPhrase(string searchPhrase, [FromQuery] int page = 1)
    {
        var o = _organisationsRepository.SearchOrganization(searchPhrase, page);
        
        return Ok(o);
    }

    [HttpGet]
    [Route("settings/{organisationUniqueName}/")]
    public IActionResult GetSettings(string organisationUniqueName)
    {
        try
        {
            return Ok(_organisationsRepository.GetOrganisation(organisationUniqueName));
        } catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }
    }
    [HttpPut]
    [Route("settings/{organisationUniqueName}/")]
    [TokenAuthorizeFilter]
    public IActionResult UpdateSettings(OrganisationUpdateFormDto newOrganisationData)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        
        try
        {
            return Ok(_organisationsRepository.UpdateOrganisation(newOrganisationData, requestUser));
        } catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }
    }
    
    [HttpDelete]
    [Route("{organisationUniqueName}/")]
    [TokenAuthorizeFilter]
    public IActionResult DeleteOrganisation(string organisationUniqueName)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        
        try
        {
            _organisationsRepository.RemoveOrganisation(organisationUniqueName, requestUser);
            return Ok();
        } catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }
    }
}