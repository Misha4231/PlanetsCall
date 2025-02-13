using Data.DTO.Global;
using Data.DTO.Item;
using Data.Models;
using Data.Repository.Item;
using Data.Repository.Log;
using Data.Repository.User;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Filters;
using PlanetsCall.Services.Caching;

namespace PlanetsCall.Controllers.Item;

[Route("api/[controller]")]
[ApiController]
public class ItemsController(
    IUsersRepository usersRepository,
    ILogsRepository logsRepository,
    IItemsRepository itemsRepository)
    : ControllerBase
{
    private readonly IUsersRepository _usersRepository = usersRepository;
    private readonly ILogsRepository _logsRepository = logsRepository;

    [HttpGet]
    [Cache]
    [Route("{categoryId}/")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetItemsBatch([FromRoute] int categoryId, [FromQuery] int page = 1) // Fetches a batch of items by category and paginates them
    {
        PaginatedList<MinItemDto> pageItems = itemsRepository.GetItemsPartition(categoryId, page); // Retrieves a paginates list of items for given category

        return Ok(pageItems);
    }

    [HttpPost]
    [Route("buy/{itemId}/")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult BuyItem(int itemId) // but item from shop
    {
        Users? requestUser = HttpContext.GetRouteValue("requestUser") as Users;

        try
        {
            itemsRepository.GiveItem(requestUser!, itemId); // call repository method to validate everything and give item
        }
        catch (CodeException e)
        { // some mistake has been found
            return StatusCode(e.Code, new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }

        return Ok();
    }

    [HttpGet]
    [Cache]
    [Route("categories/")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetCategories() // gets all categories (without pagination because there won't be many of it)
    {
        return Ok(itemsRepository.GetCategories());
    }
    
    [HttpPost]
    [AdminOnlyFilter]
    [Route("")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status415UnsupportedMediaType)]
    public IActionResult AddItem([FromBody] MinItemDto item) // adds item, so uses can buy it later
    {
        try
        {
            Items newItem = itemsRepository.AddItem(item); // add to database
            return Ok(newItem);
        }
        catch(CodeException e)
        {
            return StatusCode(e.Code, new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }
    }
    
    [HttpPost]
    [AdminOnlyFilter]
    [Route("categories/")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status415UnsupportedMediaType)]
    public IActionResult AddCategory([FromBody] MinCategoryDto category) // adds category, so later it can be adjusted to item
    {
        try
        {
            ItemsCategory newCategory = itemsRepository.AddCategory(category); // add to database
            return Ok(newCategory);
        }
        catch (CodeException e)
        {
            return StatusCode(e.Code, new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }
    }
    
    [HttpPut]
    [AdminOnlyFilter]
    [Route("{itemId}/")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status415UnsupportedMediaType)]
    public IActionResult UpdateItem([FromBody] MinItemDto item, int itemId) // updates item data
    {
        try
        {
            itemsRepository.UpdateItem(item, itemId); // update item in database
            return Ok();
        }
        catch (CodeException e)
        {
            return StatusCode(e.Code, new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }
    }
    [HttpPut]
    [AdminOnlyFilter]
    [Route("categories/{categoryId}/")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status415UnsupportedMediaType)]
    public IActionResult UpdateCategory([FromBody] MinCategoryDto category, int categoryId) // updates category data
    {
        try
        {
            itemsRepository.UpdateCategory(category, categoryId); // update category in database
            return Ok();
        }
        catch (CodeException e)
        {
            return StatusCode(e.Code, new ErrorResponse(new List<string>() { e.Message }, e.Code, HttpContext.TraceIdentifier));
        }
    }
    
    [HttpDelete]
    [AdminOnlyFilter]
    [Route("")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult DeleteItem([FromBody] int itemId) // deletes item
    {
        bool isSuccess = itemsRepository.DeleteItem(itemId);
        return (isSuccess ? Ok() : BadRequest());
    }
    [HttpDelete]
    [AdminOnlyFilter]
    [Route("categories/")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult DeleteCategory([FromBody] int categoryId) // deletes category
    {
        bool isSuccess = itemsRepository.DeleteCategory(categoryId);
        return (isSuccess ? Ok() : BadRequest());
    }
}