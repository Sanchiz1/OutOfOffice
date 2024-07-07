export interface Project {
    id: number
    projectType: string,
    startDate: Date,
    endDate?: Date,
    projectManagerId: number,
    comment?: string,
    status: string
}