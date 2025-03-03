using Microsoft.Extensions.DependencyInjection;
using Data.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using DotNetEnv;
using DotNetEnv;

namespace Data;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection RegisterDataServices(this IServiceCollection services, IConfiguration configuration)
    {
        var databaseConnectionString = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("POSTGRES_USER")) ? 
            "host=" + Environment.GetEnvironmentVariable("POSTGRES_HOST") +
            ";port=" + Environment.GetEnvironmentVariable("POSTGRES_POST") + 
            ";database=" + Environment.GetEnvironmentVariable("POSTGRES_DB") + 
            ";username=" + Environment.GetEnvironmentVariable("POSTGRES_USER") +
            ";password=" + Environment.GetEnvironmentVariable("POSTGRES_PASSWORD")
            : configuration.GetConnectionString("PostgresConnection");

        services.AddDbContext<PlatensCallContext>(o =>
        {
            o.UseNpgsql(databaseConnectionString);
        });

        return services;
    }
}