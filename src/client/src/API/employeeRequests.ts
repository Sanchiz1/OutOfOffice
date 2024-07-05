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

export function updateUserRequest(UserInput: UserInput) {
    return GetAjaxObservable(`/account`, "PATCH", true, {'Content-Type': 'application/json'}, false, UserInput).pipe(
        map(() => {
            return "User updated successfully";
        })
    );
}

export function updateUserRoleRequest(userId: number, roleId: number) {
    return GetAjaxObservable(`/users/role`, "PATCH", true, {'Content-Type': 'application/json'}, true, {userId: userId, roleId: roleId}).pipe(
        map(() => {
            return "User updated successfully";
        })
    );
}

export function changeUserPasswordRequest(password: string, newPassword: string) {
    return GetAjaxObservable(`/account/password`, "PATCH", true, {'Content-Type': 'application/json'}, true, {password: password, newPassword: newPassword}).pipe(
        map(() => {
            return "Password updated successfully";
        })
    );
}

export function DeleteAccountRequest(userId: number, password: string) {
    return GetAjaxObservable(`/account?userId=${userId}&password=${password}`, "DELETE", true, {'Content-Type': 'application/json'}, true).pipe(
        map(() => {
            return "Account deleted successfully";
        })
    );
}

export function DeleteUserRequest(userId: number, password: string) {
    return GetAjaxObservable(`/users?userId=${userId}&password=${password}`, "DELETE", true, {'Content-Type': 'application/json'}, true).pipe(
        map(() => {
            return "User deleted successfully";
        })
    );
}

export function requestUploadUserAvatar(formData: FormData) {
    console.log(formData);
    return GetAjaxObservable(`/account/avatar`, "POST", true, {}, true, formData).pipe(
        map(() => {
            return "Avatar changed successfully";
        })
    );
}

export function requestDeleteUserAvatar() {
    return GetAjaxObservable(`/account/avatar`, "DELETE", true, {}, true).pipe(
        map(() => {
            return "Avatar deleted successfully";
        })
    );
}