using Data.DTO.Global;
using Data.DTO.Item;
using Data.Models;
using Data.Repository.Item;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.Item;

[Route("api/[controller]")]
[ApiController]
public class SelectedItemsController(IItemsRepository itemsRepository) : ControllerBase
{
    [HttpGet]
    [Route("")]
    [TokenAuthorizeFilter]
    public IActionResult GetSelectedItems([FromQuery] int? categoryId = null, [FromQuery] int page = 1)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;
        PaginatedList<MinItemDto> pageItems = itemsRepository.GetItemsPartition(page, categoryId, requestUser, true);
        
        return Ok(pageItems);
    }

    [HttpPost]
    [Route("{itemId}/")]
    [TokenAuthorizeFilter]
    public IActionResult SelectItem(int itemId)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;

        bool success = itemsRepository.SelectItem(itemId, requestUser!);
        if (success)
            return Ok();
        
        return BadRequest("Not valid item id was given");
    }

    [HttpDelete]
    [Route("{itemId}/")]
    [TokenAuthorizeFilter]
    public IActionResult DeselectItem(int itemId)
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;

        bool success = itemsRepository.DeselectItem(itemId, requestUser!);
        if (success)
            return Ok();
        
        return BadRequest("Not valid item id was given");
    }
}