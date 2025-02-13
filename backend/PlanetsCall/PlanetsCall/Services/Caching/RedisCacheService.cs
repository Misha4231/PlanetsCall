using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;

namespace PlanetsCall.Services.Caching;

/*
 * Simple service to set and get value from redis storage
 */
public class RedisCacheService(IDistributedCache cache) : IRedisCacheService
{
    private readonly IDistributedCache _cache = cache;

    public T? GetData<T>(string key) //get value by key
    {
        var data = _cache.GetString(key);

        if (data is null) return default(T);
        
        return JsonSerializer.Deserialize<T>(data);
    }

    public void SetData<T>(string key, T value) // set value with key
    {
        var options = new DistributedCacheEntryOptions() {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1)
        };
        
        _cache.SetString(key, JsonSerializer.Serialize(value), options);
    }
}