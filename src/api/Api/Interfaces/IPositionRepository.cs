using Api.Data;
using Api.Models;

namespace Api.Interfaces;

public interface IPositionRepository
{
    Task<List<Position>> Get(int skip, int take, string orderBy, string order = "ASC");

    Task<List<Position>> GetAll(string orderBy, string order = "ASC");

    Task<Position?> GetById(int id);

    Task<int> Add(Position position);

    Task Update(Position position);

    Task DeleteById(int id);
}
