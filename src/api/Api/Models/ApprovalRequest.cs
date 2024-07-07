using Api.Common.Constants;

namespace Api.Models;

public class ApprovalRequest
{
    public int Id { get; set; }
    public int ApproverId { get; set; }
    public int LeaveRequestId { get; set; }
    public string Status { get; set; } = LeaveRequestStatuses.New;
    public string? Comment { get; set; }
}
