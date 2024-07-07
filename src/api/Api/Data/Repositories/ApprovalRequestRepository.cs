using Api.Models;
using Dapper;

namespace Api.Data.Repositories;

public class ApprovalRequestRepository
{
    private readonly DapperContext _dapperContext;

    public ApprovalRequestRepository(DapperContext context)
    {
        _dapperContext = context;
    }
    public async Task<List<ApprovalRequest>> Get(int skip, int take, string orderBy, string order = "ASC")
    {
        string query = $@"SELECT a.Id,
                        a.ApproverId,
                        a.PositionId,
                        a.LeaveRequestId,
                        a.Status,
                        a.Comment
                        FROM ApprovalRequests a
                        ORDER BY {orderBy} {order}
                        OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<ApprovalRequest>(query, new { skip, take });

        return result.ToList();
    }

    public async Task<List<ApprovalRequest>> GetAll(string orderBy, string order = "ASC")
    {
        string query = $@"SELECT a.Id,
                        a.ApproverId,
                        a.PositionId,
                        a.LeaveRequestId,
                        a.Status,
                        a.Comment
                        FROM ApprovalRequests a
                        ORDER BY {orderBy} {order}";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<ApprovalRequest>(query);

        return result.ToList();
    }

    public async Task<ApprovalRequest?> GetById(int id)
    {
        string query = $@"SELECT a.Id,
                        a.ApproverId,
                        a.PositionId,
                        a.LeaveRequestId,
                        a.Status,
                        a.Comment
                        FROM ApprovalRequests a
                        WHERE a.Id = @id";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<ApprovalRequest>(query, new { id });

        return result.FirstOrDefault();
    }

    public async Task<int> Add(ApprovalRequest approvalRequest)
    {
        string query = $@"INSERT INTO ApprovalRequests
                        (ApproverId, PositionId, LeaveRequestId, Status, Comment)
                        OUTPUT INSERTED.Id
                        VALUES
                        (@ApproverId, @PositionId, @LeaveRequestId, @Status, @Comment)";

        using var connection = _dapperContext.CreateConnection();

        int taskId = await connection.QuerySingleAsync<int>(query, approvalRequest);

        return taskId;
    }

    public async Task Update(ApprovalRequest approvalRequest)
    {
        string query = $@"UPDATE ApprovalRequests
                        SET
                        ApproverId = @ApproverId,
                        PositionId = @PositionId,
                        LeaveRequestId = @LeaveRequestId,
                        Status = @Status,
                        Comment = @Comment
                        WHERE Id = @Id";

        using var connection = _dapperContext.CreateConnection();

        await connection.ExecuteAsync(query, approvalRequest);
    }

    public async Task DeleteById(int id)
    {
        string query = $@"DELETE FROM ApprovalRequests
                        WHERE Id = @id";

        using var connection = _dapperContext.CreateConnection();

        await connection.ExecuteAsync(query, new { id });
    }
}
