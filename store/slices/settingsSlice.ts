import { createSlice } from "@reduxjs/toolkit";
import { RootState } from './index';


interface IReducerState {
    currentPasswordIsVisible: boolean;
    currentPassword: string;
    newPassword: string;
    usesPassword: boolean;
}

const initialState: IReducerState = {
    currentPasswordIsVisible: false,
    currentPassword: "",
    newPassword: "",
    usesPassword: false
}

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        _toggle_current_password: (state) => {
            state.currentPasswordIsVisible = !state.currentPasswordIsVisible
        },
        _set_current_password: (state, action) => {
            state.currentPassword = action.payload
        },
        _set_new_password: (state, action) => {
            state.newPassword = action.payload
        },
        _set_uses_password: (state, action) => {
            state.usesPassword = action.payload
        }
    }
})



export default settingsSlice.reducer

export const { _set_current_password, _set_new_password, _toggle_current_password } = settingsSlice.actions

// selectors

export const selectCurrentPasswordIsVisible = (state: RootState) => state.settings.currentPasswordIsVisible;
export const selectCurrentPassword = (state: RootState) => state.settings.currentPassword
export const selectNewPassword = (state: RootState) => state.settings.newPassword;