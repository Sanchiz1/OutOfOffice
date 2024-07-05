using Api.Interfaces;
using Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;
[ApiController]
[Route("[controller]")]
public class PositionController : ControllerBase
{
    private readonly IPositionRepository _positionRepository;
    public PositionController(IPositionRepository positionRepository)
    {
        _positionRepository = positionRepository;
    }

    [HttpGet]
    [Route("all")]
    public async Task<IEnumerable<Position>> Get(string orderBy = "Id")
    {
        return await _positionRepository.GetAll(orderBy);
    }
}
