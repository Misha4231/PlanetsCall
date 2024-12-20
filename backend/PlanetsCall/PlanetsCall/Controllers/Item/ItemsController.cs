using Data.DTO.Global;
using Data.DTO.Item;
using Data.Models;
using Data.Repository.Item;
using Data.Repository.Log;
using Data.Repository.User;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Controllers.Exceptions;
using PlanetsCall.Filters;

namespace PlanetsCall.Controllers.Item;

[Route("api/[controller]")]
[ApiController]
public class ItemsController : ControllerBase
{
    private readonly IUsersRepository _usersRepository;
    private readonly ILogsRepository _logsRepository;
    private readonly IItemsRepository _itemsRepository;
    
    public ItemsController(IUsersRepository usersRepository, ILogsRepository logsRepository, IItemsRepository itemsRepository)
    {
        _usersRepository = usersRepository;
        _logsRepository = logsRepository;
        _itemsRepository = itemsRepository;
    }

    [HttpGet]
    [Route("{categoryId}/")]
    public IActionResult GetItemsBatch([FromRoute] int categoryId, [FromQuery] int page = 1)
    {
        PaginatedList<Items> pageItems = _itemsRepository.GetItemsPartition(categoryId, page);

        return Ok(pageItems);
    }

    [HttpPost]
    [Route("buy/{itemId}/")]
    [TokenAuthorizeFilter]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult BuyItem(int itemId)
    {
        Users requestUser = HttpContext.GetRouteValue("requestUser") as Users;

        try
        {
            _itemsRepository.GiveItem(requestUser!, itemId);
        }
        catch (Exception e)
        {
            return BadRequest(new ErrorResponse(new List<string>() { e.Message }, 400, HttpContext.TraceIdentifier));
        }

        return Ok();
    }

    [HttpGet]
    [Route("categories/")]
    public IActionResult GetCategories()
    {
        return Ok(_itemsRepository.GetCategories());
    }
    
    [HttpPost]
    [AdminOnlyFilter]
    [Route("")]
    public IActionResult AddItem([FromBody] MinItemDTO item)
    {
        #nullable enable
        Items? newItem = _itemsRepository.AddItem(item);
        if (newItem is null)
        {
            return BadRequest(new ErrorResponse(new List<string>() { "Error occured while adding item" }, 400, HttpContext.TraceIdentifier));
        }
        
        #nullable disable
        return Ok(newItem);
    }
    
    [HttpPost]
    [AdminOnlyFilter]
    [Route("categories/")]
    public IActionResult AddCategory([FromBody] MinCategoryDTO category)
    {
        ItemsCategory newCategory = _itemsRepository.AddCategory(category);
        return Ok(newCategory);
    }
    
    [HttpPut]
    [AdminOnlyFilter]
    [Route("")]
    public IActionResult UpdateItem([FromBody] UpdateItemDTO item)
    {
        bool isSuccess = _itemsRepository.UpdateItem(item);
        return (isSuccess ? Ok() : BadRequest());
    }
    [HttpPut]
    [AdminOnlyFilter]
    [Route("categories/")]
    public IActionResult UpdateCategory([FromBody] UpdateCategoryDto category)
    {
        bool isSuccess = _itemsRepository.UpdateCategory(category);
        return (isSuccess ? Ok() : BadRequest());
    }
    
    [HttpDelete]
    [AdminOnlyFilter]
    [Route("")]
    public IActionResult DeleteItem([FromBody] int itemId)
    {
        bool isSuccess = _itemsRepository.DeleteItem(itemId);
        return (isSuccess ? Ok() : BadRequest());
    }
    [HttpDelete]
    [AdminOnlyFilter]
    [Route("categories/")]
    public IActionResult DeleteCategory([FromBody] int categoryId)
    {
        bool isSuccess = _itemsRepository.DeleteCategory(categoryId);
        return (isSuccess ? Ok() : BadRequest());
    }
}