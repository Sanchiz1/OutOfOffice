import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee } from "../../Types/Employee"

export interface AccountState {
    Account: Employee,
    GlobalError: string,
    PermissionError: string,
    LogInError: string
}
const initialState: AccountState = {
    Account: {} as Employee,
    GlobalError: '',
    PermissionError: '',
    LogInError: ''
};

export const AccountSlice = createSlice({
    name: "Account",
    initialState,
    reducers: {
        getAccount: (state,
            action: PayloadAction<Employee>) => {
            state.Account = action.payload;
        },
        setLogInError: (state,
            action: PayloadAction<string>) => {
            state.LogInError = action.payload;
        },
        setPermissionError: (state,
            action: PayloadAction<string>) => {
            state.PermissionError = action.payload;
        },
        setGlobalError: (state,
            action: PayloadAction<string>) => {
            state.GlobalError = action.payload;
        }
    }
});

export const {
    getAccount,
    setLogInError,
    setGlobalError,
    setPermissionError
} = AccountSlice.actions;
export default AccountSlice.reducer;