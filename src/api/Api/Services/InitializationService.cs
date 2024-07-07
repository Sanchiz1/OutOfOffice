using Api.Common.Constants;
using Api.Common.Exceptions;
using Api.Interfaces;
using Api.Models;

namespace Api.Services;

public class InitializationService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly HashingService _hashingService;

    public InitializationService(IEmployeeRepository employeeRepository, HashingService hashingService)
    {
        _employeeRepository = employeeRepository;
        _hashingService = hashingService;
    }

    public async Task InitDatabase()
    {
        var employees = await _employeeRepository.Get(0, 1, nameof(Employee.Id));

        if (!employees.Any()) await AddAdministrator();
    }
    private async Task AddAdministrator()
    {
        var admin = new Employee()
        {
            FullName = "Admin",
            Email = "admin",
            Position = Positions.Administrator,
            Status = Statuses.Active,
            Subdivision = "",
            Password = "admin"
        };

        admin.Password = _hashingService.ComputeHash(admin.Password);
        
        await _employeeRepository.Add(admin);
    }
}
