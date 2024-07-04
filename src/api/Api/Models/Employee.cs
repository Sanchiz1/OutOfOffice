namespace Api.Models;

public class Employee
{
    public int Id { get; set; }
    public required string FullName { get; set; }
    public int PositionId { get; set; }
    public required string Subdivision { get; set; }
    public required string Status { get; set; }
    public int PeoplePartner { get; set; }
    public int OutOfOfficeBalance { get; set; }
    public required string Password { get; set; }
}
