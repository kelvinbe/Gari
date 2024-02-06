import { createSlice } from "@reduxjs/toolkit";

const initialState: {
    errorType: string,
    error: string
} = {
    errorType: "",
    error: ""
}

const errorSlice = createSlice({
    name: "errorSlice",
    initialState: initialState,
    reducers: {
        setError: (state, action) => {
            state.errorType = action.payload.errorType;
            state.error = action.payload.error;
        }
    }
})

export default errorSlice.reducer;

// actions
export const { setError } = errorSlice.actions;

// selectors
export const selectError = (state: any) => ({error: state.error, errorType: state.errorType});