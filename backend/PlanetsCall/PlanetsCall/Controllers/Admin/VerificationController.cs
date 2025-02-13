using Data.Models;
using Data.Repository.Community;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.Admin;

/*
 * controller manages verification requests made by organisation creators
 * Only user with admin permissions can work with this controller
 */
[Route("/api/admin/organisations/[controller]")]
[ApiController]
public class VerificationController(
    IVerificationRepository verificationRepository,
    IOrganisationsRepository organisationsRepository)
    : ControllerBase
{
    [HttpGet]
    [Cache]
    [AdminOnlyFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetRequests() // gets a list of all verification requests and put it into DTO (to make organisation data smaller)
    {
        return Ok(verificationRepository.GetRequestsList());
    }

    [HttpPost("{organisationName}/{action}/")]
    [AdminOnlyFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult ApproveRequest(string organisationName, string action)// approves or rejects request
    { 
        if (action != "approve" && action != "reject") // check if action is valid
        {
            return BadRequest(new ErrorResponse(new List<string>() { "Available actions: approve, reject" }, StatusCodes.Status400BadRequest,
                HttpContext.TraceIdentifier));
        }

        try {
            Organisations org = organisationsRepository.GetObjOrganisation(organisationName);
            if (org.VerificationRequest is null) // check if organisation creator really made request
            {
                return BadRequest(new ErrorResponse(new List<string>() { "Organisation owner didn't request verification" }, StatusCodes.Status400BadRequest,
                    HttpContext.TraceIdentifier));
            }
            
            if (action == "approve") // if approve, than set isVerified equals true
                verificationRepository.VerifyOrganisation(org);
            verificationRepository.DeleteRequest(org.VerificationRequest); // delete request after processing it

            return Ok();
        }
        catch (CodeException ex)
        {
            return StatusCode(ex.Code ,new ErrorResponse(new List<string>() { ex.Message }, ex.Code, HttpContext.TraceIdentifier));
        }
    }
}