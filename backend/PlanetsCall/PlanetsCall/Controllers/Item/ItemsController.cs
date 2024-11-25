using Data.Repository.Log;
using Data.Repository.User;
using Microsoft.AspNetCore.Mvc;

namespace PlanetsCall.Controllers.Item;

[Route("api/[controller]")]
[ApiController]
public class ItemsController
{
    private readonly IUsersRepository _usersRepository;
    private readonly ILogsRepository _logsRepository;
    
    public ItemsController(IUsersRepository usersRepository, ILogsRepository logsRepository)
    {
        _usersRepository = usersRepository;
        _logsRepository = logsRepository;
    }

}