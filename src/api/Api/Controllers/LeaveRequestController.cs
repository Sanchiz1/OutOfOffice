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
    public LeaveRequestController(ILeaveRequestRepository leaveRequestRepository)
    {
        _leaveRequestRepository = leaveRequestRepository;
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
        var leaveRequest = await _leaveRequestRepository.GetById(id);

        if (leaveRequest is null) return NotFound();

        var userId = User.GetUserId();

        if (userId == 0) return Unauthorized();

        if (userId != leaveRequest.EmployeeId) return BadRequest(new Error("Only owner can submit leave request"));

        if (leaveRequest.Status == LeaveRequestStatuses.Submitted) return BadRequest(new Error("Request already submitted"));

        leaveRequest.Status = LeaveRequestStatuses.Submitted;

        await _leaveRequestRepository.Update(leaveRequest);

        return Ok();
    }
}