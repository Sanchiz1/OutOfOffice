using Api.Common.Constants;

namespace Api.Models;

public class LeaveRequest
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public required string AbsenceReason { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Comment { get; set; }
    public string Status { get; set; } = LeaveRequestStatuses.New;
}
