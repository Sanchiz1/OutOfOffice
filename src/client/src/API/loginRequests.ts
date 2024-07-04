import { map } from "rxjs";
import { deleteCookie, getCookie, setCookie } from "../Helpers/CookieHelper";
import { getAccount } from "../Redux/Reducers/AccountReducer";
import { User } from "../Types/User";
import { GetAjaxObservable } from "./APIUtils";

export type LoginType = {
  token: string,
  expires: Date,
  issued: Date
}


export function LoginRequest(loginOrEmail: string, password: string) {
  return GetAjaxObservable<LoginType>(`/account/login`, "POST", false, {'Content-Type': 'application/json'}, true, {
    'usernameOrEmail': loginOrEmail,
    'password': password
  }).pipe(
    map((value) => {
      setCookie({
        name: "access_token",
        value: JSON.stringify(value.response.data.token),
        expires_second: (new Date(value.response.data.expires).getTime() - new Date(value.response.data.issued).getTime()) / 1000,
        path: "/"
      });
    })
  );
}

export const Logout = () => {
  deleteCookie("access_token");
  getAccount({} as User);
}

export function isSigned(): boolean {
  const accessToken = getCookie("access_token");
  return !!accessToken;
}