using System.Data;
using System.Data.SqlClient;

namespace Api.Data;

public class DapperContext
{
    private readonly string _connectionString;
    public DapperContext(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("SQLConnection")
            ?? throw new ArgumentNullException("Connection string not found");
    }
    public IDbConnection CreateConnection()
        => new SqlConnection(_connectionString);
}
