using Api.Data;
using Api.Data.Repositories;
using Api.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddSingleton<DapperContext>();
builder.Services.AddSingleton<IPositionRepository, PositionRepository>();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
