using Data.Models;
using Data.Repository.User;
using Microsoft.Extensions.DependencyInjection;

namespace Data;

// service that will update the database and add admin user to Users table if not exist
public static class DatabasePrepare
{
    public static IServiceCollection PrepareDatabase(this IServiceCollection services)
    {
        var isMigrationMode = Environment.GetEnvironmentVariable("RUNNING_MIGRATIONS");
        if (isMigrationMode == "true")
        {
            return services;
        }
        using (var scope = services.BuildServiceProvider().CreateScope())
        {
            // create default admin
            var adminUsername = Environment.GetEnvironmentVariable("POSTGRES_USER");
            var password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
            if (adminUsername != null && password != null) // app have default admin
            {
                var userRepo = scope.ServiceProvider.GetRequiredService<IUsersRepository>();
                var existingAdmin = userRepo.GetUserByUsername(adminUsername);
                if (existingAdmin == null)
                {
                    // insert admin
                    userRepo.InsertUser(new Users()
                    {
                        Username = adminUsername,
                        Password = password,
                        Email = "",
                        PreferredLanguage = "en",
                        AccountType = 1,
                        Status = "online"
                    });
                }
            }
        }
        
        return services;
    }
}