import { catchError, map, of } from "rxjs";
import { Employee, UpdateUserInput } from "../Types/Employee";
import { GetAjaxObservable } from "./APIUtils";
import NotFoundError from "../Types/NotFoundError";
import { Project } from "../Types/Project";

export function requestProjects(offset: Number, next: Number, orderBy: string = "Id", order: string = "ASC") {
    return GetAjaxObservable<Project[]>(`/project?take=${next}&skip=${offset}&orderBy=${orderBy}&order=${order}`, "GET", false, {'Content-Type': 'application/json'}, false)
}

export function requestEmployeeProjects(employeeId: number, offset: Number, next: Number, orderBy: string = "Id", order: string = "ASC") {
    return GetAjaxObservable<Project[]>(`/project/employee/${employeeId}?take=${next}&skip=${offset}&orderBy=${orderBy}&order=${order}`, "GET", false, {'Content-Type': 'application/json'}, false)
}

export function getProjectById(id: Number) {
    return GetAjaxObservable<Project>(`/project/${id}`, "GET", false, {'Content-Type': 'application/json'}, false).pipe(
        catchError((error) => {
            if(error instanceof NotFoundError){
                return of(null);
            }

            throw error
        })
    );
}

export function createProject(projectType: string, startDate: Date, endDate?: Date, comment?: string ) {
    return GetAjaxObservable(`/project`, "POST", false, {'Content-Type': 'application/json'}, false, {
        "ProjectType": projectType,
        "StartDate": startDate.toISOString(),
        "EndDate": endDate ? endDate.toISOString() : null,
        "Comment": comment
    }).pipe(
        map((value) => {
            return "Project created successfully"
      })
    );
}

export function updateProject(id: number, projectType: string, status: string, startDate: Date, endDate?: Date, comment?: string) {
    return GetAjaxObservable(`/project/${id}`, "PUT", false, {'Content-Type': 'application/json'}, false, {
        "ProjectType": projectType,
        "StartDate": startDate.toISOString(),
        "EndDate": endDate ? endDate.toISOString() : null,
        "Comment": comment,
        "Status": status
    }).pipe(
        map((value) => {
            return "Project updated successfully"
      })
    );
}

export function addToProject(id: number, employeeId: number) {
    return GetAjaxObservable(`/project/${id}/add?employeeId=${employeeId}`, "POST", false, {'Content-Type': 'application/json'}, false).pipe(
        map((value) => {
            return "Employee added successfully"
      })
    );
}

export function removeFromProject(id: number, employeeId: number) {
    return GetAjaxObservable(`/project/${id}/remove?employeeId=${employeeId}`, "POST", false, {'Content-Type': 'application/json'}, false).pipe(
        map((value) => {
            return "Employee remove successfully"
      })
    );
}