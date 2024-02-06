import { createSlice } from "@reduxjs/toolkit";

interface Issues {
    name: string;
    email: string;
    message: string
}

const initialState: {
    issues: Issues[]
} = {
    issues: []
}

const issuesSlice = createSlice({
    name: "issuesSlice",
    initialState: initialState,
    reducers: {
        setIssues: (state, action) => {
            state.issues = action.payload.issues
        }
    }
})

export default issuesSlice.reducer;

// actions
export const { setIssues } = issuesSlice.actions;

// selectors
export const selectIssues = (state: any) => state.issues;