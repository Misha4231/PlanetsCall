using Data.Repository.Community;
using Microsoft.AspNetCore.Mvc;

namespace PlanetsCall.Controllers.Community;

[ApiController]
[Route("/api/community/[controller]")]
public class OrganisationsController : ControllerBase
{
    private readonly IOrganisationsRepository _organisationsRepository;
    public OrganisationsController(IOrganisationsRepository organisationsRepository)
    {
        this._organisationsRepository = organisationsRepository;
    }
    
    
}