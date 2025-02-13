using Microsoft.AspNetCore.Mvc.Filters;

namespace PlanetsCall.Filters;

/*
 * Extends CacheAttribute adding access token to make user request unique
 */
[AttributeUsage(AttributeTargets.Method)]
public class UserCacheAttribute : CacheAttribute
{
    public override string GenerateKeyCache(FilterContext context) // override method in CacheAttribute method
    {
        var authToken = context.HttpContext.Request.Headers.Authorization; // get header
        return $"{base.GenerateKeyCache(context)}:{authToken}"; // add to the default key
    }
}