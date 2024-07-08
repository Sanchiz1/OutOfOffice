using Api.Data;
using Api.Models;

namespace Api.Interfaces;

public interface IApprovalRequestRepository
{
    Task<List<ApprovalRequest>> Get(int skip, int take, string orderBy, string order = "ASC");

    Task<List<ApprovalRequest>> GetByApprover(int approverId, int skip, int take, string orderBy, string order = "ASC");

    Task<List<ApprovalRequest>> GetAll(string orderBy, string order = "ASC");

    Task<ApprovalRequest?> GetById(int id);

    Task<int> Add(ApprovalRequest approvalRequest);

    Task Update(ApprovalRequest approvalRequest);
    Task UpdateStatusByLeaveRequestId(int leaveRequestId, string status);

    Task DeleteById(int id);
}
