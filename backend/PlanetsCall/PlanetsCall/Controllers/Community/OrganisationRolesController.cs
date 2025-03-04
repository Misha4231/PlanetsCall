using Core.Exceptions;
using Data.DTO.Community;
using Data.Models;
using Data.Repository.Community;
using Data.Repository.User;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.Community;

[Route("/api/community/organisations/{organisationName}/roles/")]
[ApiController]
[OrganisationFilter]
public class OrganisationRolesController(
    IOrganisationsRepository organisationsRepository,
    IUsersRepository usersRepository)
    : ControllerBase
{
    [HttpGet]
    [UserCache]
    [TokenAuthorizeFilter]
    public IActionResult GetRoles()
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        Organisations? organisation = HttpContext.GetRouteValue("Organisation") as Organisations;
        if (organisation!.IsPrivate && organisation.Members != null && requestUser != null && !organisation.Members.Contains(requestUser))
        {
            return BadRequest(new ErrorResponse(["Access denied"], StatusCodes.Status400BadRequest, HttpContext.TraceIdentifier));
        }

        if (organisation.Roles != null)
        {
            var roles = organisation.Roles.Select(r => new FullRoleDto(r)).ToList();
            return Ok(roles);
        }

        return NotFound();
    }

    [HttpPost]
    [TokenAuthorizeFilter]
    public IActionResult CreateRole(RolesFormDto role)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        Organisations? organisation = HttpContext.GetRouteValue("Organisation") as Organisations;
        
        try
        {
            organisationsRepository.EnsureUserHasPermission(requestUser!, organisation!.UniqueName, roles => roles.CanConfigureRoles);
            FullRoleDto newRole = organisationsRepository.CreateRole(organisation, role);

            return Ok(newRole);
        }
        catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse([e.Message], e.Code, HttpContext.TraceIdentifier));
        }
    }

    [HttpPut]
    [Route("{roleId}/")]
    [TokenAuthorizeFilter]
    public IActionResult UpdateRole(RolesFormDto role, int roleId)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        Organisations? organisation = HttpContext.GetRouteValue("Organisation") as Organisations;

        try
        {
            if (requestUser != null && organisation != null)
            {
                organisationsRepository.EnsureUserHasPermission(requestUser, organisation.UniqueName,
                    roles => roles.CanConfigureRoles);
                FullRoleDto newRoleData = organisationsRepository.UpdateRole(organisation, role, roleId);

                return Ok(newRoleData);
            }
        }
        catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse([e.Message], e.Code, HttpContext.TraceIdentifier));
        }

        return BadRequest();
    }
    [HttpDelete]
    [Route("{roleId}/")]
    [TokenAuthorizeFilter]
    public IActionResult DeleteRole(int roleId)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        Organisations? organisation = HttpContext.GetRouteValue("Organisation") as Organisations;

        try
        {
            if (requestUser != null && organisation != null)
            {
                organisationsRepository.EnsureUserHasPermission(requestUser, organisation.UniqueName,
                    role => role.CanConfigureRoles);
                organisationsRepository.DeleteRole(roleId);
                return NoContent();
            }
        }
        catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse([e.Message], e.Code, HttpContext.TraceIdentifier));
        }
        
        return BadRequest();
    }
    [HttpPost]
    [Route("{roleId}/grant/{userId}/")]
    [TokenAuthorizeFilter]
    public IActionResult GrantUserRole(int roleId, int userId)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        Organisations? organisation = HttpContext.GetRouteValue("Organisation") as Organisations;

        try
        {
            Users? user = usersRepository.GetUserById(userId);
            if (user is null) return NotFound();


            if (requestUser != null && organisation != null)
            {
                organisationsRepository.EnsureUserHasPermission(requestUser, organisation.UniqueName,
                    role => role.CanConfigureRoles);
                organisationsRepository.GrantRole(organisation, user, roleId);
                
                return NoContent();
            }
        }
        catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse([e.Message], e.Code, HttpContext.TraceIdentifier));
        }
        
        return BadRequest();
    }
    
    [HttpPost]
    [Route("{roleId}/revoke/{userId}/")]
    [TokenAuthorizeFilter]
    public IActionResult RevokeUserRole(int roleId, int userId)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        Organisations? organisation = HttpContext.GetRouteValue("Organisation") as Organisations;

        try
        {
            Users? user = usersRepository.GetUserById(userId);
            if (user is null) return NotFound();

            if (requestUser != null && organisation != null)
            {
                organisationsRepository.EnsureUserHasPermission(requestUser, organisation.UniqueName,
                    role => role.CanConfigureRoles);
                organisationsRepository.RevokeRole(organisation, user, roleId);

                return NoContent();
            }
        }
        catch (CodeException e)
        {
            return StatusCode(e.Code ,new ErrorResponse([e.Message], e.Code, HttpContext.TraceIdentifier));
        }
        
        return BadRequest();
    }
}