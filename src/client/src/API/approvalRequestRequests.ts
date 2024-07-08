import { map } from "rxjs";
import { GetAjaxObservable } from "./APIUtils";
import { ApprovalRequest } from "../Types/ApprovalRequest";

export function getLeaveRequests(offset: number, next: number, orderBy: string = "Id", order: string = "ASC") {
    return GetAjaxObservable<ApprovalRequest[]>(`/approvalRequest?take=${next}&skip=${offset}&orderBy=${orderBy}&order=${order}`, "GET", false, {'Content-Type': 'application/json'}, false)
}

export function getApproverApprovalRequests(approverId: number, offset: number, next: number, orderBy: string = "Id", order: string = "ASC") {
    return GetAjaxObservable<ApprovalRequest[]>(`/approvalRequest/approver/${approverId}?take=${next}&skip=${offset}&orderBy=${orderBy}&order=${order}`, "GET", false, {'Content-Type': 'application/json'}, false)
}

export function getApprovalRequestById(approvalRequestId: number) {
    return GetAjaxObservable<ApprovalRequest>(`/approvalRequest/${approvalRequestId}`, "GET", false, {'Content-Type': 'application/json'}, false)
}

export function updateApprovalRequest(id: number, comment?: string ) {
    return GetAjaxObservable(`/approvalRequest/${id}`, "PUT", false, {'Content-Type': 'application/json'}, false, {
        "Comment": comment
    }).pipe(
        map((value) => {
            return "Approval request updated successfully"
      })
    );
}

export function cancelApprovalRequest(id: number) {
    return GetAjaxObservable(`/approvalRequest/${id}/cancel`, "PATCH", false, {'Content-Type': 'application/json'}, false).pipe(
        map((value) => {
            return "Approval request canceled successfully"
      })
    );
}

export function submitApprovalRequest(id: number) {
    return GetAjaxObservable(`/approvalRequest/${id}/submit`, "PATCH", false, {'Content-Type': 'application/json'}, false).pipe(
        map((value) => {
            return "Approval request submitted successfully"
      })
    );
}