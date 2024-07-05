export interface Employee {
    id: number,
    fullName: string,
    email: string,
    positionId: number,
    subdivision: string,
    status: string,
    peoplePartner?: number,
    outOfOfficeBalance: number
}
export interface UserRegistration {
    id: number,
    username: string,
    email: string,
    bio: string,
    password: string
}

export interface UserInput {
    username: string,
    email: string,
    bio?: string,
    password?: string
}