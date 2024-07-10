using Api.Interfaces;
using Api.Models;
using Dapper;

namespace Api.Data.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly DapperContext _dapperContext;

    public EmployeeRepository(DapperContext context)
    {
        _dapperContext = context;
    }
    public async Task<List<Employee>> Get(int skip, int take, string orderBy, string order = "ASC")
    {
        string query = $@"SELECT e.Id,
                        e.Fullname,
                        e.Email,
                        e.Position,
                        e.Subdivision,
                        e.Status,
                        e.PeoplePartner,
                        e.OutOfOfficeBalance
                        FROM Employees e
                        ORDER BY {orderBy} {order}
                        OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Employee>(query, new { skip, take });

        return result.ToList();
    }

    public async Task<List<Employee>> GetAll(string orderBy, string order = "ASC")
    {
        string query = $@"SELECT e.Id,
                        e.Fullname,
                        e.Email,
                        e.Position,
                        e.Subdivision,
                        e.Status,
                        e.PeoplePartner,
                        e.OutOfOfficeBalance
                        FROM Employees e
                        ORDER BY {orderBy} {order}";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Employee>(query);

        return result.ToList();
    }

    public async Task<List<Employee>> GetBySearch(string search, int skip, int take, string orderBy, string order = "ASC")
    {
        string query = $@"SELECT e.Id,
                        e.Fullname,
                        e.Email,
                        e.Position,
                        e.Subdivision,
                        e.Status,
                        e.PeoplePartner,
                        e.OutOfOfficeBalance
                        FROM Employees e
                        WHERE e.Fullname LIKE '%{search}%'
                        ORDER BY {orderBy} {order}
                        OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Employee>(query, new { skip, take });

        return result.ToList();
    }

    public async Task<List<Employee>> GetByProject(int projectId, string search, int skip, int take, string orderBy, string order = "ASC")
    {
        string query = $@"SELECT e.Id,
                        e.Fullname,
                        e.Email,
                        e.Position,
                        e.Subdivision,
                        e.Status,
                        e.PeoplePartner,
                        e.OutOfOfficeBalance
                        FROM EmployeeProject pe
                        INNER JOIN Employees e ON e.Id = pe.EmployeeId
                        WHERE e.Fullname LIKE '%{search}%' AND pe.ProjectId = @projectId
                        GROUP BY e.Id,
                        e.Fullname,
                        e.Email,
                        e.Position,
                        e.Subdivision,
                        e.Status,
                        e.PeoplePartner,
                        e.OutOfOfficeBalance
                        ORDER BY {orderBy} {order}
                        OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Employee>(query, new { skip, take, projectId });

        return result.ToList();
    }

    public async Task<List<Employee>> GetAllProjectManagers(int employeeId, string orderBy, string order = "ASC")
    {
        string query = $@"SELECT e.Id,
                        e.Fullname,
                        e.Email,
                        e.Position,
                        e.Subdivision,
                        e.Status,
                        e.PeoplePartner,
                        e.OutOfOfficeBalance
                        FROM EmployeeProject pe
                        INNER JOIN Projects p ON p.Id = pe.ProjectId
                        INNER JOIN Employees e ON e.Id = p.ProjectManagerId
                        WHERE pe.EmployeeId = @employeeId
                        GROUP BY e.Id,
                        e.Fullname,
                        e.Email,
                        e.Position,
                        e.Subdivision,
                        e.Status,
                        e.PeoplePartner,
                        e.OutOfOfficeBalance
                        ORDER BY {orderBy} {order}";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Employee>(query, new { employeeId });

        return result.ToList();
    }

    public async Task<Employee?> GetById(int id)
    {
        string query = $@"SELECT e.Id,
                        e.Fullname,
                        e.Email,
                        e.Position,
                        e.Subdivision,
                        e.Status,
                        e.PeoplePartner,
                        e.OutOfOfficeBalance
                        FROM Employees e
                        WHERE e.Id = @id";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Employee>(query, new { id });

        return result.FirstOrDefault();
    }

    public async Task<Employee?> GetByEmail(string email)
    {
        string query = $@"SELECT e.Id,
                        e.Fullname,
                        e.Email,
                        e.Position,
                        e.Subdivision,
                        e.Status,
                        e.PeoplePartner,
                        e.OutOfOfficeBalance
                        FROM Employees e
                        WHERE e.Email = @email";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Employee>(query, new { email });

        return result.FirstOrDefault();
    }

    public async Task<string?> GetPasswordById(int id)
    {
        string query = $@"SELECT e.Password
                        FROM Employees e
                        WHERE e.Id = @id";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.ExecuteScalarAsync<string>(query, new { id });

        return result;
    }

    public async Task<int> Add(Employee employee)
    {
        string query = $@"INSERT INTO Employees
                        (Fullname, Email, Position, Subdivision, Status, PeoplePartner, OutOfOfficeBalance, Password)
                        OUTPUT INSERTED.Id
                        VALUES
                        (@Fullname, @Email, @Position, @Subdivision, @Status, @PeoplePartner, @OutOfOfficeBalance, @Password)";

        using var connection = _dapperContext.CreateConnection();

        int taskId = await connection.QuerySingleAsync<int>(query, employee);

        return taskId;
    }

    public async Task Update(Employee employee)
    {
        string query = $@"UPDATE Employees
                        SET
                        Fullname = @Fullname,
                        Email = @Email,
                        Position = @Position,
                        Subdivision = @Subdivision,
                        Status = @Status,
                        PeoplePartner = @PeoplePartner,
                        OutOfOfficeBalance = @OutOfOfficeBalance
                        WHERE Id = @Id";

        using var connection = _dapperContext.CreateConnection();

        await connection.ExecuteAsync(query, employee);
    }

    public async Task UpdatePassword(int id, string password)
    {
        string query = $@"UPDATE Employees
                        SET
                        Password = @password
                        WHERE Id = @id";

        using var connection = _dapperContext.CreateConnection();

        await connection.ExecuteAsync(query, new { id, password});
    }

    public async Task DeleteById(int id)
    {
        string query = $@"DELETE FROM Employees
                        WHERE Id = @id";

        using var connection = _dapperContext.CreateConnection();

        await connection.ExecuteAsync(query, new { id });
    }
}
