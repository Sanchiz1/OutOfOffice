using Api.Models;

namespace Api.Interfaces;

public interface IEmployeeRepository
{
    Task<List<Employee>> Get(int skip, int take, string orderBy, string order = "ASC");

    Task<List<Employee>> GetAll(string orderBy, string order = "ASC");

    Task<List<Employee>> GetBySearch(string search, int skip, int take, string orderBy, string order = "ASC");

    Task<List<Employee>> GetByProject(int projectId, string search, int skip, int take, string orderBy, string order = "ASC");

    Task<List<Employee>> GetAllProjectManagers(int employeeId, string orderBy, string order = "ASC");

    Task<Employee?> GetById(int id);

    Task<Employee?> GetByEmail(string email);

    Task<string?> GetPasswordById(int id);

    Task<int> Add(Employee position);

    Task Update(Employee position);

    Task DeleteById(int id);
}
