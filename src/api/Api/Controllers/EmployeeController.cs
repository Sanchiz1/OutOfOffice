using Api.Common.Constants;
using Api.Dtos;
using Api.Extensions;
using Api.Interfaces;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly HashingService _hashingService;
    private readonly TokenService _tokenService;
    public EmployeeController(IEmployeeRepository employeeRepository, HashingService hashingService, TokenService tokenService)
    {
        _employeeRepository = employeeRepository;
        _hashingService = hashingService;
        _tokenService = tokenService;
    }

    [HttpGet]
    public async Task<IEnumerable<Employee>> Get(int take, int skip, string orderBy, string order = "ASC")
    {
        return await _employeeRepository.Get(skip, take, orderBy, order);
    }

    [HttpGet]
    [Route("all")]
    public async Task<IEnumerable<Employee>> GetAll(string orderBy, string order = "ASC")
    {
        return await _employeeRepository.GetAll(orderBy, order);
    }

    [HttpGet]
    [Route("current")]
    public async Task<ActionResult<Employee>> GetCurrentEmployee()
    {
        var userId = User.GetUserId();

        if (userId == 0) return Unauthorized();

        var user = await _employeeRepository.GetById(userId);

        if (user is null) return NotFound();
        return user;
    }

    [HttpGet]
    [Route("search")]
    public async Task<ActionResult<IEnumerable<Employee>>> GetSearchedEmployees(int skip, int take, string search = "", string orderBy = "Id", string order = "ASC")
    {
        return await _employeeRepository.GetBySearch(search, skip, take, orderBy, order);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<Employee>> GetEmployeeById(int id)
    {
        var user = await _employeeRepository.GetById(id);

        if (user is null) return NotFound();

        return user;
    }

    [HttpGet]
    [Route("project/{projectId}")]
    public async Task<ActionResult<IEnumerable<Employee>>> GetSearchedEmployees(int projectId, int skip, int take, string search = "", string orderBy = "Id", string order = "ASC")
    {
        return await _employeeRepository.GetByProject(projectId, search, skip, take, orderBy, order);
    }

    [HttpPost]
    [Route("Login")]
    public async Task<ActionResult<Token>> Login([FromBody] LoginDto request)
    {
        var employee = await _employeeRepository.GetByEmail(request.Email);

        if (employee is null) return BadRequest(new Error("Wrong email or password"));

        var empPassword = await _employeeRepository.GetPasswordById(employee.Id);

        if (_hashingService.ComputeHash(request.Password) != empPassword || employee.Status == Statuses.Inactive) return BadRequest(new Error("Wrong email or password"));

        return _tokenService.GenerateToken(employee);
    }

    [HttpPut]
    [Route("{id}")]
    [Authorize(Roles = Positions.HRManager + "," + Positions.Administrator)]
    public async Task<ActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto request)
    {
        var emailCheck = await _employeeRepository.GetByEmail(request.Email);

        if (emailCheck is not null && emailCheck.Id != id) return BadRequest(new Error("Employee with this email already exists"));

        var employee = await _employeeRepository.GetById(id);

        if (employee is null) return NotFound();

        employee.FullName = request.FullName;
        employee.Email = request.Email;
        employee.Subdivision = request.Subdivision;
        employee.Status = request.Status;
        employee.Position = request.Position;
        employee.PeoplePartner = request.PeoplePartner;
        employee.OutOfOfficeBalance = request.OutOfOfficeBalance;

        await _employeeRepository.Update(employee);

        return Ok();
    }

    [HttpPost]
    [Authorize(Roles = Positions.HRManager + "," + Positions.Administrator)]
    public async Task<ActionResult> CreateEmployee([FromBody] CreateEmployeeDto request)
    {
        var emailCheck = await _employeeRepository.GetByEmail(request.Email);

        if (emailCheck is not null) return BadRequest(new Error("Employee with this email already exists"));

        var employee = new Employee()
        {
            FullName = request.FullName,
            Email = request.Email,
            Subdivision = request.Subdivision,
            Status = Statuses.Active,
            Position = request.Position,
            PeoplePartner = request.PeoplePartner,
            OutOfOfficeBalance = request.OutOfOfficeBalance,
            Password = request.password
        };

        await _employeeRepository.Update(employee);

        return Ok();
    }
}
