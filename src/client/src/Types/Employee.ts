export interface Employee {
    id: number,
    fullName: string,
    email: string,
    position: string,
    subdivision: string,
    status: string,
    peoplePartner?: number,
    outOfOfficeBalance: number
}
export interface UserRegistration {
    id: number,
    fullName: string,
    email: string,
    position: string,
    subdivision: string,
    status: string,
    peoplePartner?: number,
    outOfOfficeBalance: number,
    password: string,
}

export interface UpdateUserInput {
    FullName: string,
    Email: string,
    Position: string,
    Subdivision: string,
    Status: string,
    PeoplePartner?: number,
    OutOfOfficeBalance: number
}

export interface CreateUserInput {
    FullName: string,
    Email: string,
    Position: string,
    Subdivision: string,
    Status: string,
    PeoplePartner?: number,
    OutOfOfficeBalance: number,
    Password: string
}