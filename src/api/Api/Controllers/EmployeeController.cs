using Api.Interfaces;
using Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeRepository _employeeRepository;
    public EmployeeController(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    [HttpGet]
    public async Task<IEnumerable<Employee>> Get(int take, int skip, string orderBy, string order = "ASC")
    {
        return await _employeeRepository.Get(take, skip, orderBy, order);
    }
}
