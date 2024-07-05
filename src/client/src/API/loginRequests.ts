import { map } from "rxjs";
import { deleteCookie, getCookie, setCookie } from "../Helpers/CookieHelper";
import { getAccount } from "../Redux/Reducers/AccountReducer";
import { Employee } from "../Types/Employee";
import { GetAjaxObservable } from "./APIUtils";

export type LoginType = {
  value: string,
  expires: Date,
  issued: Date
}

export function LoginRequest(email: string, password: string) {
  return GetAjaxObservable<LoginType>(`/employee/login`, "POST", false, {'Content-Type': 'application/json'}, false, {
    'email': email,
    'password': password
  }).pipe(
    map((value) => {
      setCookie({
        name: "access_token",
        value: JSON.stringify(value.value),
        expires_second: (new Date(value.expires).getTime() - new Date(value.issued).getTime()) / 1000,
        path: "/"
      });
    })
  );
}

export const Logout = () => {
  deleteCookie("access_token");
  getAccount({} as Employee);
}

export function isSigned(): boolean {
  const accessToken = getCookie("access_token");
  return !!accessToken;
}