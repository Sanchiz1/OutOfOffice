import { map } from "rxjs";
import { LeaveRequest } from "../Types/LeaveRequest";
import { GetAjaxObservable } from "./APIUtils";

export function getLeaveRequests(offset: number, next: number, orderBy: string = "Id", order: string = "ASC") {
    return GetAjaxObservable<LeaveRequest[]>(`/leaveRequest?take=${next}&skip=${offset}&orderBy=${orderBy}&order=${order}`, "GET", false, {'Content-Type': 'application/json'}, false)
}

export function getEmployeeLeaveRequests(employeeId: number, offset: number, next: number, orderBy: string = "Id", order: string = "ASC") {
    return GetAjaxObservable<LeaveRequest[]>(`/leaveRequest/employee/${employeeId}?take=${next}&skip=${offset}&orderBy=${orderBy}&order=${order}`, "GET", false, {'Content-Type': 'application/json'}, false)
}

export function getLeaveRequestById(leaveRequestId: number) {
    return GetAjaxObservable<LeaveRequest>(`/leaveRequest/${leaveRequestId}`, "GET", false, {'Content-Type': 'application/json'}, false)
}

export function createLeaveRequest(absenceReason: string, startDate: Date, endDate: Date, comment?: string ) {
    return GetAjaxObservable(`/leaveRequest`, "POST", false, {'Content-Type': 'application/json'}, false, {
        "AbsenceReason": absenceReason,
        "StartDate": startDate.toISOString(),
        "EndDate": endDate.toISOString(),
        "Comment": comment
    }).pipe(
        map((value) => {
            return "Leave request created successfully"
      })
    );
}

export function updateLeaveRequest(id: number, absenceReason: string, startDate: Date, endDate: Date, comment?: string ) {
    return GetAjaxObservable(`/leaveRequest/${id}`, "PUT", false, {'Content-Type': 'application/json'}, false, {
        "AbsenceReason": absenceReason,
        "StartDate": startDate.toISOString(),
        "EndDate": endDate.toISOString(),
        "Comment": comment
    }).pipe(
        map((value) => {
            return "Leave request updated successfully"
      })
    );
}

export function cancelLeaveRequest(id: number) {
    return GetAjaxObservable(`/leaveRequest/${id}/cancel`, "PATCH", false, {'Content-Type': 'application/json'}, false).pipe(
        map((value) => {
            return "Leave request canceled successfully"
      })
    );
}

export function submitLeaveRequest(id: number) {
    return GetAjaxObservable(`/leaveRequest/${id}/submit`, "PATCH", false, {'Content-Type': 'application/json'}, false).pipe(
        map((value) => {
            return "Leave request submitted successfully"
      })
    );
}