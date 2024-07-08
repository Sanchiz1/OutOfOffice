export interface ApprovalRequest {
    id: number,
    approverId: number,
    leaveRequestId: string,
    comment?: string,
    status: string
}