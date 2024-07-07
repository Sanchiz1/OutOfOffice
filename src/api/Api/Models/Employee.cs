namespace Api.Models;

public class Employee
{
    public int Id { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string Position { get; set; }
    public required string Subdivision { get; set; }
    public required string Status { get; set; }
    public int? PeoplePartner { get; set; }
    public int OutOfOfficeBalance { get; set; }
    public required string Password { get; set; }
}
