namespace Api.Dtos;

public record CreateProjectDto(string ProjectType, DateTime StartDate, DateTime? EndDate, string? Comment);
