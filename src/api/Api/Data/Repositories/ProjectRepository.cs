using Api.Models;
using Dapper;

namespace Api.Data.Repositories;

public class ProjectRepository
{
    private readonly DapperContext _dapperContext;

    public ProjectRepository(DapperContext context)
    {
        _dapperContext = context;
    }
    public async Task<List<Project>> Get(int skip, int take, string orderBy, string order = "ASC")
    {
        string query = $@"SELECT p.Id,
                        p.ProjectType,
                        p.StartDate,
                        p.EndDate,
                        p.ProjectManager,
                        p.Comment,
                        p.Status
                        FROM Projects p
                        ORDER BY {orderBy} {order}
                        OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Project>(query, new { skip, take });

        return result.ToList();
    }

    public async Task<List<Project>> GetAll(string orderBy, string order = "ASC")
    {
        string query = $@"SELECT p.Id,
                        p.ProjectType,
                        p.StartDate,
                        p.EndDate,
                        p.ProjectManager,
                        p.Comment,
                        p.Status
                        FROM Projects p
                        ORDER BY {orderBy} {order}";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Project>(query);

        return result.ToList();
    }

    public async Task<Project?> GetById(int id)
    {
        string query = $@"SELECT p.Id,
                        p.ProjectType,
                        p.StartDate,
                        p.EndDate,
                        p.ProjectManager,
                        p.Comment,
                        p.Status
                        FROM Projects p
                        WHERE t.Id = @id";

        using var connection = _dapperContext.CreateConnection();

        var result = await connection.QueryAsync<Project>(query, new { id });

        return result.FirstOrDefault();
    }

    public async Task<int> Add(Project project)
    {
        string query = $@"INSERT INTO Projects
                        (ProjectType, StartDate, EndDate, ProjectManager, Comment, Status)
                        OUTPUT INSERTED.Id
                        VALUES
                        (@ProjectType, @StartDate, @EndDate, @ProjectManager, @Comment, @Status)";

        using var connection = _dapperContext.CreateConnection();

        int taskId = await connection.QuerySingleAsync<int>(query, project);

        return taskId;
    }

    public async Task Update(Project project)
    {
        string query = $@"UPDATE Projects
                        SET
                        ProjectType = @ProjectType,
                        StartDate = @StartDate,
                        EndDate = @EndDate,
                        ProjectManager = @ProjectManager,
                        Comment = @Comment,
                        Status = @Status
                        WHERE Id = @Id";

        using var connection = _dapperContext.CreateConnection();

        await connection.ExecuteAsync(query, project);
    }

    public async Task DeleteById(int id)
    {
        string query = $@"DELETE FROM Projects
                        WHERE Id = @id";

        using var connection = _dapperContext.CreateConnection();

        await connection.ExecuteAsync(query, new { id });
    }
}
