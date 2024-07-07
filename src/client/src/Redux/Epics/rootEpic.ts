import { combineEpics, Epic } from "redux-observable";
import { catchError } from "rxjs";
import { getUserAccountEpic, setPositionsEpic } from "./AccountEpics";

export const rootEpic: Epic = (action$, store$, dependencies) =>
    combineEpics(
        getUserAccountEpic,
        setPositionsEpic
    )(action$, store$, dependencies).pipe(
        catchError((error, source) => {
            return source;
        })
    );