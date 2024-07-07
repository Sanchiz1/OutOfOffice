namespace Api.Dtos;

public record UpdateEmployeeDto(string FullName, string Email, string Subdivision, string Status, string Position, int? PeoplePartner, int OutOfOfficeBalance);