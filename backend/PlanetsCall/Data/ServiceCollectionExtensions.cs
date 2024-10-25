using Microsoft.Extensions.DependencyInjection;
using Data.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection RegisterDataServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<PlatensCallContext>(o =>
        {
            o.UseNpgsql(configuration.GetConnectionString("PostgresConnection"));
        });
        
        return services;
    }
}