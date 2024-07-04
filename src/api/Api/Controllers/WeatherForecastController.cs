using Api.Interfaces;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private readonly IPositionRepository _positionRepository;
    public WeatherForecastController(IPositionRepository positionRepository)
    {
        _positionRepository = positionRepository;
    }

    [HttpGet]
    public async Task<IEnumerable<Position>> Get()
    {
        return await _positionRepository.GetAll("Id");
    }
}
