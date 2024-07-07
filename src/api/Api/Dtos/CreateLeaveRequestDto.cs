namespace Api.Dtos;

public record CreateLeaveRequestDto(string AbsenceReason, DateTime StartDate, DateTime EndDate, string? Comment);
