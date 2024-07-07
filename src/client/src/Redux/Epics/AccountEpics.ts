import { Epic, ofType } from "redux-observable";
import { catchError, map, merge, mergeMap, of } from "rxjs";
import { requestAccount } from "../../API/employeeRequests";
import { Employee } from "../../Types/Employee";
import { getAccount, setLogInError, setPostions } from "../Reducers/AccountReducer";
import { requestPositions } from "../../API/positionRequests";
import { Position } from "../../Types/Position";

export const getUserAccount = () => ({ type: "getUserAccount" });
export const getUserAccountEpic: Epic = action$ => action$.pipe(
    ofType("getUserAccount"),
    mergeMap(() => requestAccount().pipe(
        map((res: Employee) => getAccount(res))
    )),
    catchError((error, caught) =>
        merge(of(setLogInError(error.message)),
            caught
        ))
);

export const setPositionsAction = () => ({ type: "setPostionsAction" });
export const setPositionsEpic: Epic = action$ => action$.pipe(
    ofType("setPostionsAction"),
    mergeMap(() => requestPositions().pipe(
        map((res: Position[]) => setPostions(res))
    ))
);