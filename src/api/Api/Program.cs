using Api.Data;
using Api.Data.Repositories;
using Api.Interfaces;
using Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddSingleton<HashingService>();
builder.Services.AddSingleton<DapperContext>();
builder.Services.AddSingleton<IPositionRepository, PositionRepository>();
builder.Services.AddSingleton<IEmployeeRepository, EmployeeRepository>();

builder.Services.AddSingleton<InitializationService>();

var app = builder.Build();

{
    using var scope = app.Services.CreateScope();
    var initializationService = scope.ServiceProvider.GetRequiredService<InitializationService>();
    await initializationService.InitDatabase();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
