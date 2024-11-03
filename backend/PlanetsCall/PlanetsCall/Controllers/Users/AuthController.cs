using Microsoft.AspNetCore.Mvc;
using Data.Context;

namespace PlanetsCall.Controllers.Users
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly PlatensCallContext _context;

        public AuthController(PlatensCallContext context)
        {
            _context = context;
        }

    }
}
