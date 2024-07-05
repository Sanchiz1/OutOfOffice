import { Employee, UserInput } from "../Types/Employee";
import { Position } from "../Types/Position";
import { GetAjaxObservable } from "./APIUtils";

export function requestPositions() {
    return GetAjaxObservable<Position[]>(`/position/all?orderBy=Id`, "GET", false, {'Content-Type': 'application/json'}, false);
}