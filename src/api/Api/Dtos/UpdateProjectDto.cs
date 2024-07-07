namespace Api.Dtos;

public record UpdateProjectDto(string ProjectType, DateTime StartDate, DateTime? EndDate, string? Comment, string Status);
