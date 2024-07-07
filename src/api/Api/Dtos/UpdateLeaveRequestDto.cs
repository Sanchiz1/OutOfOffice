namespace Api.Dtos;

public record UpdateLeaveRequestDto(
    string AbsenceReason,
    DateTime StartDate,
    DateTime EndDate,
    string? Comment);
