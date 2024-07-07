using Api.Common.Constants;
using Api.Data.Repositories;
using Api.Dtos;
using Api.Extensions;
using Api.Interfaces;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ProjectController : ControllerBase
{
    private readonly IProjectRepository _projectRepository;
    public ProjectController(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    [HttpGet]
    public async Task<IEnumerable<Project>> GeProjects(int take, int skip, string orderBy, string order = "ASC")
    {
        return await _projectRepository.Get(skip, take, orderBy, order);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<Project>> GetEmployeeById(int id)
    {
        var project = await _projectRepository.GetById(id);

        if (project is null) return NotFound();

        return project;
    }

    [HttpGet]
    [Route("employee/{id}")]
    public async Task<IEnumerable<Project>> GeEmployeeProjects(int id, int take, int skip, string orderBy, string order = "ASC")
    {
        return await _projectRepository.Get(skip, take, orderBy, order);
    }

    [HttpPost]
    [Authorize(Roles = Positions.ProjectManager + "," + Positions.Administrator)]
    public async Task<ActionResult> CreateProject([FromBody] CreateProjectDto request)
    {
        var userId = User.GetUserId();

        if (userId == 0) return Unauthorized();

        var project = new Project()
        {
            ProjectType = request.ProjectType,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Comment = request.Comment,
            ProjectManagerId = userId
        };

        await _projectRepository.Add(project);

        return Ok();
    }

    [HttpPut]
    [Route("{id}")]
    [Authorize(Roles = Positions.ProjectManager + "," + Positions.Administrator)]
    public async Task<ActionResult> UpdatProject(int id, [FromBody] UpdateProjectDto request)
    {
        var project = await _projectRepository.GetById(id);

        if (project is null) return NotFound();

        var userId = User.GetUserId();

        if (userId == 0) return Unauthorized();

        project.ProjectType = request.ProjectType;
        project.StartDate = request.StartDate;
        project.EndDate = request.EndDate;
        project.Comment = request.Comment;
        project.Status = request.Status;
        

        await _projectRepository.Update(project);

        return Ok();
    }

    [HttpPost]
    [Route("{id}/remove")]
    [Authorize(Roles = Positions.ProjectManager + "," + Positions.Administrator)]
    public async Task<ActionResult> RemoveFromProject(int id, int employeeId)
    {
        if (!await _projectRepository.IsInProject(id, employeeId)) return BadRequest(new Error("Employee is not in the project"));

        await _projectRepository.RemoveEmployeeFromProject(id, employeeId);

        return Ok();
    }

    [HttpPost]
    [Route("{id}/add")]
    [Authorize(Roles = Positions.ProjectManager + "," + Positions.Administrator)]
    public async Task<ActionResult> AddToProject(int id, int employeeId)
    {
        if (await _projectRepository.IsInProject(id, employeeId)) return BadRequest(new Error("Employee is already in the project"));

        await _projectRepository.AddEmployeeToProject(id, employeeId);

        return Ok();
    }
}