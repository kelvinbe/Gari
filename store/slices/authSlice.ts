import { createSlice } from "@reduxjs/toolkit";

const initialState: {
    authenticated: boolean
} = {
    authenticated: false
}

const authSlice = createSlice({
    name: "authSlice",
    initialState: initialState,
    reducers: {
        setAuthenticated: (state, action) => {
            state.authenticated = action.payload.authenticated
        }
    }
})

export default authSlice.reducer;

// actions
export const { setAuthenticated } = authSlice.actions;

// selectors
export const selectAuthenticated = (state: any) => state.authenticated;