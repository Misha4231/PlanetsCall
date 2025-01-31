using Data.Context;
using Microsoft.Extensions.Configuration;

namespace Data.Repository;

// base class for repositories to not repeat injections
public class RepositoryBase
{
    protected readonly PlatensCallContext Context;
    protected readonly IConfiguration Configuration;
    protected RepositoryBase(PlatensCallContext context, IConfiguration configuration)
    {
        this.Context = context;
        this.Configuration = configuration;
    }
}