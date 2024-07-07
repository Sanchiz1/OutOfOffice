using Api.Common.Constants;

namespace Api.Models;

public class Project
{
    public int Id { get; set; }
    public required string ProjectType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int ProjectManagerId { get; set; }
    public string? Comment{ get; set; }
    public string Status { get; set; } = Statuses.Active;
}
