import { catchError, of, throwError } from "rxjs";
import { ajax } from "rxjs/internal/ajax/ajax";
import { getCookie } from "../Helpers/CookieHelper";
import { isSigned } from "./loginRequests";
import NotFoundError from "../Types/NotFoundError";

const url = "http://localhost:7223";

export type response<T = any> = {
  data: T,
  error?: string
}

export function GetAjaxObservable<T>(requestUrl: string,
  method: string,
  needsAuth: boolean,
  headers: any,
  withCredentials: boolean = false,
  body: any = null
  ) {
  if (needsAuth || isSigned()) {

    let token = getCookie("access_token")!;

    if (token === null) return throwError(() => new Error("Invalid token"));

    headers = { ...headers, ...{ 'Authorization': 'Bearer ' + token } };
  }

  return ajax<response<T>>({
    url: url + requestUrl,
    method: method,
    headers: headers,
    body: body,
    withCredentials: withCredentials,
  }).pipe(
    catchError((error) => {
      if (error?.response?.error == null || error.status == 500) {
        throw new Error("Internal error")
      }

      if (error.status == 401) {
        throw new Error("Unauthorized")
      }

      if (error.status == 404) {
        throw new NotFoundError(error.response.error);
      }

      throw new Error(error.response.error);
    }))
}