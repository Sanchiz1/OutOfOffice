using Api.Interfaces;
using Api.Models;
using Dapper;

namespace Api.Data.Repositories;

public class PositionRepository : IPositionRepository
{
    private readonly DapperContext _dapperContext;

    public PositionRepository(DapperContext context)
    {
        _dapperContext = context;
    }
    public async Task<List<Position>> Get(int skip, int take, string orderBy, string order = "ASC")
    {
        string query = $@"SELECT p.Id,
                        p.Name
                        FROM Positions p
                        ORDER BY {orderBy} {order}
                        OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Position>(query, new { skip, take });

        return result.ToList();
    }

    public async Task<List<Position>> GetAll(string orderBy, string order = "ASC")
    {
        string query = $@"SELECT p.Id,
                        p.Name
                        FROM Positions p
                        ORDER BY {orderBy} {order}";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Position>(query);

        return result.ToList();
    }

    public async Task<Position?> GetById(int id)
    {
        string query = $@"SELECT p.Id,
                        p.Name
                        FROM Positions p
                        WHERE t.Id = @id";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Position>(query, new { id });

        return result.FirstOrDefault();
    }

    public async Task<int> Add(Position position)
    {
        string query = $@"INSERT INTO Employees
                        (Name)
                        OUTPUT INSERTED.Id
                        VALUES
                        (@Name)";

        using var connection = _dapperContext.CreateConnection();

        int taskId = await connection.QuerySingleAsync<int>(query, position);

        return taskId;
    }

    public async Task Update(Position position)
    {
        string query = $@"UPDATE Positions
                        SET 
                        Name = @Name
                        WHERE Id = @Id";

        using var connection = _dapperContext.CreateConnection();

        await connection.ExecuteAsync(query, position);
    }

    public async Task DeleteById(int id)
    {
        string query = $@"DELETE FROM Positions
                        WHERE Id = @id";

        using var connection = _dapperContext.CreateConnection();

        await connection.ExecuteAsync(query, new { id });
    }
}
