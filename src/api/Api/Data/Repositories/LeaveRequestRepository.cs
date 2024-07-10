using Api.Interfaces;
using Api.Models;
using Dapper;

namespace Api.Data.Repositories;

public class LeaveRequestRepository : ILeaveRequestRepository
{
    private readonly DapperContext _dapperContext;

    public LeaveRequestRepository(DapperContext context)
    {
        _dapperContext = context;
    }

    public async Task<List<LeaveRequest>> Get(int skip, int take, string orderBy, string order = "ASC")
    {
        string query = $@"SELECT l.Id,
                        l.EmployeeId,
                        l.AbsenceReason,
                        l.StartDate,
                        l.EndDate,
                        l.Comment,
                        l.Status
                        FROM LeaveRequests l
                        ORDER BY {orderBy} {order}
                        OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<LeaveRequest>(query, new { skip, take });

        return result.ToList();
    }

    public async Task<List<LeaveRequest>> GetByEmployeeId(int employeeId, int skip, int take, string orderBy, string order = "ASC")
    {
        string query = $@"SELECT l.Id,
                        l.EmployeeId,
                        l.AbsenceReason,
                        l.StartDate,
                        l.EndDate,
                        l.Comment,
                        l.Status
                        FROM LeaveRequests l
                        WHERE l.EmployeeId = @employeeId
                        ORDER BY {orderBy} {order}
                        OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<LeaveRequest>(query, new { skip, take, employeeId });

        return result.ToList();
    }

    public async Task<List<LeaveRequest>> GetAll(string orderBy, string order = "ASC")
    {
        string query = $@"SELECT l.Id,
                        l.EmployeeId,
                        l.AbsenceReason,
                        l.StartDate,
                        l.EndDate,
                        l.Comment,
                        l.Status
                        FROM LeaveRequests l
                        ORDER BY {orderBy} {order}";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<LeaveRequest>(query);

        return result.ToList();
    }

    public async Task<LeaveRequest?> GetById(int id)
    {
        string query = $@"SELECT l.Id,
                        l.EmployeeId,
                        l.AbsenceReason,
                        l.StartDate,
                        l.EndDate,
                        l.Comment,
                        l.Status
                        FROM LeaveRequests l
                        WHERE l.Id = @id";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<LeaveRequest>(query, new { id });

        return result.FirstOrDefault();
    }

    public async Task<int> Add(LeaveRequest leaveRequest)
    {
        string query = $@"INSERT INTO LeaveRequests
                        (EmployeeId, AbsenceReason, StartDate, EndDate, Comment, Status)
                        OUTPUT INSERTED.Id
                        VALUES
                        (@EmployeeId, @AbsenceReason, @StartDate, @EndDate, @Comment, @Status)";

        using var connection = _dapperContext.CreateConnection();

        int taskId = await connection.QuerySingleAsync<int>(query, leaveRequest);

        return taskId;
    }

    public async Task Update(LeaveRequest leaveRequest)
    {
        string query = $@"UPDATE LeaveRequests
                        SET
                        EmployeeId = @EmployeeId,
                        AbsenceReason = @AbsenceReason,
                        StartDate = @StartDate,
                        EndDate = @EndDate,
                        Comment = @Comment,
                        Status = @Status
                        WHERE Id = @Id";

        using var connection = _dapperContext.CreateConnection();

        await connection.ExecuteAsync(query, leaveRequest);
    }

    public async Task DeleteById(int id)
    {
        string query = $@"DELETE FROM LeaveRequests
                        WHERE Id = @id";

        using var connection = _dapperContext.CreateConnection();

        await connection.ExecuteAsync(query, new { id });
    }
}
