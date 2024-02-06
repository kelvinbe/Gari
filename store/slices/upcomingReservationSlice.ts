import { createSlice } from "@reduxjs/toolkit";
import { IReservation } from '../../types';
import { RootState } from ".";

const initialState: {
    reservations: IReservation[]
} = {
    reservations: []
}

const upcomingSlice = createSlice({
    name: "upcoming",
    initialState,
    reducers: {
        setGetUpcomingReservations:(state, action) => {
            state.reservations = action.payload
        } 
    },
})

export default upcomingSlice.reducer;

export const {setGetUpcomingReservations} = upcomingSlice.actions

export const selectUpcomingReservations = (state:RootState) => state.upcoming.reservations