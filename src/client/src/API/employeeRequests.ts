import { catchError, map, of } from "rxjs";
import { Employee, UserInput } from "../Types/Employee";
import { GetAjaxObservable } from "./APIUtils";
import NotFoundError from "../Types/NotFoundError";

export function requestUsers() {
    return GetAjaxObservable<Employee[]>(`/employee/all?orderBy=Id`, "GET", false, {'Content-Type': 'application/json'}, false);
}

export function requestSearchedEmployees(offset: Number, next: Number, search: string, orderBy: string = "Id", order: string = "ASC") {
    return GetAjaxObservable<Employee[]>(`/employee/search?search=${search}&take=${next}&skip=${offset}&orderBy=${orderBy}&order=${order}`, "GET", false, {'Content-Type': 'application/json'}, false)
}

export function requestProjectEmployees(projectId: number, offset: Number, next: Number, search: string, orderBy: string = "Id", order: string = "ASC") {
    return GetAjaxObservable<Employee[]>(`/employee/project/${projectId}?search=${search}&take=${next}&skip=${offset}&orderBy=${orderBy}&order=${order}`, "GET", false, {'Content-Type': 'application/json'}, false)
}

export function requestEmployeeById(id: Number) {
    return GetAjaxObservable<Employee>(`/employee/${id}`, "GET", false, {'Content-Type': 'application/json'}, false).pipe(
        catchError((error) => {
            if(error instanceof NotFoundError){
                return of(null);
            }

            throw error
        })
    );
}

export function requestAccount() {
    return GetAjaxObservable<Employee>(`/employee/current`, "GET", true, {'Content-Type': 'application/json'}, false).pipe(
    );
}

export function createUserRequest(UserInput: UserInput) {
    return GetAjaxObservable(`/account/register`, "POST", false, {'Content-Type': 'application/json'}, false, UserInput).pipe(
        map(() => {
            return "User created successfully";
        })
    );
}

export function updateUserRequest(id: number, UserInput: UserInput) {
    return GetAjaxObservable(`/employee/${id}`, "put", true, {'Content-Type': 'application/json'}, false, UserInput).pipe(
        map(() => {
            return "User updated successfully";
        })
    );
}