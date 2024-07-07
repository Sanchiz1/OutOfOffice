namespace Api.Dtos;

public record CreateEmployeeDto(string FullName, string Email, string Subdivision, string Position, int? PeoplePartner, int OutOfOfficeBalance, string password);
