import { createSlice } from "@reduxjs/toolkit";

const initialState: {
    status:'Reserved' | 'Cancelled'
} = {
    status:'Reserved'
}

const cancelSlice = createSlice({
    name:"cancelSlice",
    initialState:initialState,
    reducers:{
        setStatus:(state) => {
           state.status = 'Cancelled' 
        }
    }
})
export default cancelSlice.reducer

// actions
export const {setStatus} = cancelSlice.actions

//selectors
export const selectCancel = (state:any) =>  state.status