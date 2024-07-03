namespace Api.Models;

public class Project
{
    public int Id { get; set; }
    public required string ProjectType { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int ProjectManager { get; set; }
    public string? Comment{ get; set; }
    public required string Status { get; set; }
}
