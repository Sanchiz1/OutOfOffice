export interface LeaveRequest {
    id: number,
    employeeId: number,
    absenceReason: string,
    startDate: Date,
    endDate: Date,
    comment?: string,
    status: string
}