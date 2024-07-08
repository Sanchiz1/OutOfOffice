using Api.Common.Constants;
using Api.Dtos;
using Api.Extensions;
using Api.Interfaces;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class ApprovalRequestController : ControllerBase
{
    private readonly IApprovalRequestRepository _approvalRequestRepository;
    public ApprovalRequestController(IApprovalRequestRepository approvalRequestRepository)
    {
        _approvalRequestRepository = approvalRequestRepository;
    }


    [HttpGet]
    [Route("approver/{approverId}")]
    public async Task<ActionResult<IEnumerable<ApprovalRequest>>> GetApprovalRequestsByApprover(int approverId, int take, int skip, string orderBy, string order = "ASC")
    {
        return await _approvalRequestRepository.GetByApprover(approverId, skip, take, orderBy, order);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<ApprovalRequest>> GetApprovalRequestById(int id)
    {
        var leaveRequest = await _approvalRequestRepository.GetById(id);

        if (leaveRequest is null) return NotFound();

        return leaveRequest;
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<ActionResult> UpdateApprovalRequest(int id, [FromBody] UpdateApprovalRequestDto request)
    {
        var approvalRequest = await _approvalRequestRepository.GetById(id);

        if (approvalRequest is null) return NotFound();

        var userId = User.GetUserId();

        if(userId != approvalRequest.ApproverId) return BadRequest(new Error("Only approver can update request"));

        if (approvalRequest.Status != LeaveRequestStatuses.New) return BadRequest(new Error("Request is already processed"));

        approvalRequest.Comment = request.comment;

        await _approvalRequestRepository.Update(approvalRequest);

        return Ok();
    }

    [HttpPatch]
    [Route("{id}/cancel")]
    public async Task<ActionResult> CancelLeaveRequest(int id)
    {
        var approvalRequest = await _approvalRequestRepository.GetById(id);

        if (approvalRequest is null) return NotFound();

        var userId = User.GetUserId();

        if (userId != approvalRequest.ApproverId) return BadRequest(new Error("Only approver can cancel request"));

        if (approvalRequest.Status != LeaveRequestStatuses.New) return BadRequest(new Error("Request is already processed"));

        approvalRequest.Status = LeaveRequestStatuses.Canceled;

        await _approvalRequestRepository.Update(approvalRequest);

        return Ok();
    }

    [HttpPatch]
    [Route("{id}/submit")]
    public async Task<ActionResult> SubmitLeaveRequest(int id)
    {
        var approvalRequest = await _approvalRequestRepository.GetById(id);

        if (approvalRequest is null) return NotFound();

        var userId = User.GetUserId();

        if (userId != approvalRequest.ApproverId) return BadRequest(new Error("Only approver can submit request"));

        approvalRequest.Status = LeaveRequestStatuses.Submitted;

        await _approvalRequestRepository.Update(approvalRequest);

        return Ok();
    }
}