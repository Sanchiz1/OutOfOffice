using Api.Data;
using Api.Models;

namespace Api.Interfaces;

public interface IProjectRepository
{
    Task<List<Project>> Get(int skip, int take, string orderBy, string order = "ASC");

    Task<List<Project>> GetAll(string orderBy, string order = "ASC");

    Task<Project?> GetById(int id);

    Task<bool> IsInProject(int projectId, int employeeId);

    Task<int> Add(Project project);

    Task Update(Project project);

    Task DeleteById(int id);

    Task AddEmployeeToProject(int projectId, int employeeId);

    Task RemoveEmployeeFromProject(int projectId, int employeeId);
}
