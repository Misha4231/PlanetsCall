using Microsoft.AspNetCore.Mvc;
using PlanetsCall.Filters;
using Data.Context;
using Microsoft.EntityFrameworkCore;

namespace PlanetsCall.Controllers.World;

/* Controller to search available cities and countries */
[Route("api/[controller]")]
[ApiController]
public class WorldController (PlatensCallContext dbContext) : ControllerBase
{
    [Route("[action]")]
    [HttpGet]
    [Cache]
    public IActionResult SearchCities(string cityName)
    {
        return Ok(dbContext.Cities.Where(c => c.Name.Contains(cityName)).ToList());
    }
    
    [Route("city/{id}")]
    [HttpGet]
    [Cache]
    public IActionResult GetCity(int id)
    {
        return Ok(dbContext.Cities.Include(c => c.UsersCollection).FirstOrDefault(c => c.Id == id));
    }
    
    [Route("[action]")]
    [HttpGet]
    [Cache]
    public IActionResult SearchCountry(string countryName)
    {
        return Ok(dbContext.Countries.Where(c => c.Name.Contains(countryName)).ToList());
    }
    
    [Route("country/{id}")]
    [HttpGet]
    [Cache]
    public IActionResult GetCountry(int id)
    {
        return Ok(dbContext.Countries.Include(c => c.UsersCollection).FirstOrDefault(c => c.Id == id));
    }
}