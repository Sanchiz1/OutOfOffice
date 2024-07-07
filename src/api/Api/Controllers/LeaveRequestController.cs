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
[Authorize]
public class LeaveRequestController : ControllerBase
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IApprovalRequestRepository _approvalRequestRepository;
    public LeaveRequestController(ILeaveRequestRepository leaveRequestRepository, IEmployeeRepository employeeRepository, IApprovalRequestRepository approvalRequestRepository)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _employeeRepository = employeeRepository;
        _approvalRequestRepository = approvalRequestRepository;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetLeaveRequests(int take, int skip, string orderBy, string order = "ASC")
    {
        return await _leaveRequestRepository.Get(skip, take, orderBy, order);
    }

    [HttpGet]
    [Route("employee/{employeeId}")]
    public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetUserLeaveRequests(int employeeId, int take, int skip, string orderBy, string order = "ASC")
    {
        return await _leaveRequestRepository.GetByEmployeeId(employeeId, skip, take, orderBy, order);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<LeaveRequest>> GetLeaveRequestById(int id)
    {
        var leaveRequest = await _leaveRequestRepository.GetById(id);

        if (leaveRequest is null) return NotFound();

        return leaveRequest;
    }

    [HttpPost]
    public async Task<ActionResult> CreateLeaveRequest([FromBody] CreateLeaveRequestDto request)
    {
        var userId = User.GetUserId();

        if (userId == 0) return Unauthorized();

        var leaveRequest = new LeaveRequest() { 
            AbsenceReason = request.AbsenceReason,
            EmployeeId = userId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Comment = request.Comment,
        };

        await _leaveRequestRepository.Add(leaveRequest);

        return Ok();
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<ActionResult> UpdateLeaveRequest(int id, [FromBody] UpdateLeaveRequestDto request)
    {
        var leaveRequest = await _leaveRequestRepository.GetById(id);

        if (leaveRequest is null) return NotFound();

        var userId = User.GetUserId();

        if (userId == 0) return Unauthorized();

        if(userId != leaveRequest.EmployeeId) return BadRequest(new Error("Only owner can update leave request"));

        if(leaveRequest.Status == LeaveRequestStatuses.Submitted) return BadRequest(new Error("Cannot update submitted leave request"));

        leaveRequest.AbsenceReason = request.AbsenceReason;
        leaveRequest.StartDate = request.StartDate;
        leaveRequest.EndDate = request.EndDate;
        leaveRequest.Comment = request.Comment;

        await _leaveRequestRepository.Update(leaveRequest);

        return Ok();
    }

    [HttpPatch]
    [Route("{id}/cancel")]
    public async Task<ActionResult> CancelLeaveRequest(int id)
    {
        var leaveRequest = await _leaveRequestRepository.GetById(id);

        if (leaveRequest is null) return NotFound();

        var userId = User.GetUserId();

        if (userId == 0) return Unauthorized();

        if (userId != leaveRequest.EmployeeId) return BadRequest(new Error("Only owner can cancel leave request"));

        if (leaveRequest.Status != LeaveRequestStatuses.Submitted) return BadRequest(new Error("Can cancel only submitted leave request"));

        leaveRequest.Status = LeaveRequestStatuses.Canceled;

        await _leaveRequestRepository.Update(leaveRequest);

        return Ok();
    }

    [HttpPatch]
    [Route("{id}/submit")]
    public async Task<ActionResult> SubmitLeaveRequest(int id)
    {
        var userId = User.GetUserId();

        if (userId == 0) return Unauthorized();

        var leaveRequest = await _leaveRequestRepository.GetById(id);

        if (leaveRequest is null) return NotFound();

        if (userId != leaveRequest.EmployeeId) return BadRequest(new Error("Only owner can submit leave request"));

        if (leaveRequest.Status == LeaveRequestStatuses.Submitted) return BadRequest(new Error("Request already submitted"));

        leaveRequest.Status = LeaveRequestStatuses.Submitted;

        await _leaveRequestRepository.Update(leaveRequest);

        var employee = await _employeeRepository.GetById(userId);

        if (employee is null) return NotFound(new Error("Employee not found"));

        var projectManagers = await _employeeRepository.GetAllProjectManagers(userId, "Id");

        foreach (var projectManager in projectManagers)
        {
            var projectManagerApprovalRequest = new ApprovalRequest()
            {
                ApproverId = projectManager.Id,
                LeaveRequestId = leaveRequest.Id,
            };

            await _approvalRequestRepository.Add(projectManagerApprovalRequest);
        }

        if (employee.PeoplePartner is null) return Ok();

        var peoplePartnerApprovalRequest = new ApprovalRequest()
        {
            ApproverId = (int)employee.PeoplePartner,
            LeaveRequestId = leaveRequest.Id,
        };
        await _approvalRequestRepository.Add(peoplePartnerApprovalRequest);

        return Ok();
    }
}