using Api.Data;
using Api.Models;

namespace Api.Interfaces;

public interface ILeaveRequestRepository
{
    Task<List<LeaveRequest>> Get(int skip, int take, string orderBy, string order = "ASC");
    Task<List<LeaveRequest>> GetByEmployeeId(int employeeId, int skip, int take, string orderBy, string order = "ASC");

    Task<List<LeaveRequest>> GetAll(string orderBy, string order = "ASC");

    Task<LeaveRequest?> GetById(int id);

    Task<int> Add(LeaveRequest leaveRequest);

    Task Update(LeaveRequest leaveRequest);

    Task DeleteById(int id);
}
