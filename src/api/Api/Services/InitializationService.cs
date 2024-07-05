using Api.Common.Constants;
using Api.Common.Exceptions;
using Api.Interfaces;
using Api.Models;

namespace Api.Services;

public class InitializationService
{
    private readonly IPositionRepository _positionRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly HashingService _hashingService;

    public InitializationService(IPositionRepository positionRepository, IEmployeeRepository employeeRepository, HashingService hashingService)
    {
        _positionRepository = positionRepository;
        _employeeRepository = employeeRepository;
        _hashingService = hashingService;
    }

    public async Task InitDatabase()
    {
        var positions = await _positionRepository.Get(0, 1, nameof(Position.Id));
        var employees = await _employeeRepository.Get(0, 1, nameof(Employee.Id));

        if (!positions.Any()) await AddPositions();

        if (!employees.Any()) await AddAdministrator();
    }

    private async Task AddPositions()
    {
        await _positionRepository.Add(Positions.Employee);
        await _positionRepository.Add(Positions.HRManager);
        await _positionRepository.Add(Positions.ProjectManager);
        await _positionRepository.Add(Positions.Administrator);
    }

    private async Task AddAdministrator()
    {
        var adminPosition = _positionRepository.GetByName(Positions.Administrator.Name);

        if (adminPosition is null) throw new NotFoundException($"Postion not found: {Positions.Administrator.Name}");

        var admin = new Employee()
        {
            FullName = "Admin",
            Email = "admin",
            PositionId = adminPosition.Id,
            Status = Statuses.Active,
            Subdivision = "",
            Password = "admin"
        };

        admin.Password = _hashingService.ComputeHash(admin.Password);
        
        await _employeeRepository.Add(admin);
    }
}
