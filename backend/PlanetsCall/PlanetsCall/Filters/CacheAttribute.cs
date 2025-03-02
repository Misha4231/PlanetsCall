using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using PlanetsCall.Services.Caching;

namespace PlanetsCall.Filters;

/*
 * CacheAttribute allows to easily cache response from endpoint in redis
 */
[AttributeUsage(AttributeTargets.Method)]
public class CacheAttribute : ActionFilterAttribute
{
    // before method inside controller executed checks if there is a value stored
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        // get cache service
        IRedisCacheService redisCacheService = context.HttpContext.RequestServices.GetService<IRedisCacheService>()!;
        IWebHostEnvironment webHostEnvironment = context.HttpContext.RequestServices.GetService<IWebHostEnvironment>()!; // get environment
       
        if (webHostEnvironment.IsDevelopment()) // caching is disabled in development environment
        {
            return;
        }
            
        var cacheKey = GenerateKeyCache(context); // generate key according to endpoint
        var cachedResponse = redisCacheService.GetData<object>(cacheKey)?.ToString(); // try to find cached value from redis

        if (cachedResponse is not null) // if response found in cache, return it
        {
            context.Result = new ContentResult
            {
                ContentType = "application/json",
                Content = cachedResponse,
                StatusCode = 200
            };
        }
    }

    // after the method executed and data fetched, cache result data
    public override void OnActionExecuted(ActionExecutedContext context)
    {
        IRedisCacheService redisCacheService = context.HttpContext.RequestServices.GetService<IRedisCacheService>()!; // get cache service
        IWebHostEnvironment webHostEnvironment = context.HttpContext.RequestServices.GetService<IWebHostEnvironment>()!; // get environment

        if (webHostEnvironment.IsDevelopment()) // caching is disabled in development environment
        {
            return;
        }
        
        if (context.Result is ObjectResult objectResult && context.HttpContext.Response.StatusCode == 200) // if everything ok
        {
            redisCacheService.SetData(GenerateKeyCache(context), objectResult.Value); // store key in redis
        }
    }

    // generates key according to endpoint
    protected virtual string GenerateKeyCache(FilterContext context)
    {
        var path = context.HttpContext.Request.Path.ToString(); // get path
        var query = context.HttpContext.Request.QueryString.ToString(); // get query parameters
        
        return $"cache:{path}:{query}"; // construct key
    }
}