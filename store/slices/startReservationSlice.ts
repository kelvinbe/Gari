import { createSlice } from "@reduxjs/toolkit";

const initialState: {
    status:'Upcoming' | 'Ongoing'
} = {
    status:'Upcoming'
}

const startReservationSlice = createSlice({
    name:"startReservationSlice",
    initialState:initialState,
    reducers:{
        setStatus:(state) => {
           state.status = 'Ongoing' 
        }
    }
})
export default startReservationSlice.reducer

// actions
export const {setStatus} = startReservationSlice.actions

//selectors
export const selectReservationStatus = (state:any) =>  state.startReservation.status