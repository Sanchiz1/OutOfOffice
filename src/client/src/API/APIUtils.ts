import { catchError, map, of, throwError } from "rxjs";
import { ajax } from "rxjs/internal/ajax/ajax";
import { getCookie } from "../Helpers/CookieHelper";
import { isSigned } from "./loginRequests";
import NotFoundError from "../Types/NotFoundError";

const url = "https://localhost:7223";

export type response<T = any> = {
  message: string
} | T;

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

      if (error.status == 401) {
        throw new Error("Unauthorized")
      }

      if (error.status == 404) {
        throw new NotFoundError(error?.response?.message);
      }

      if (error?.response?.message == null || error.status == 500) {
        throw new Error("Internal error")
      }

      throw new Error(error.response.message);
    }),
    map((v) => v.response as T))
}