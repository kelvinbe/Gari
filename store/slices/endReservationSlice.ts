import { createSlice } from '@reduxjs/toolkit'
import { IReservation } from '../../types'

const initialState: {
    status: 'Active' | 'Ended'
} = {
    status: 'Ended'
}


const endReservationSlice = createSlice({
    name: 'endReservationSlice',
    initialState: initialState,
    reducers: {
        setEndReservationStatus: (state) => {
            state.status = 'Ended'
        }
    }
})


export default endReservationSlice.reducer


//actions
export const {setEndReservationStatus} = endReservationSlice.actions


//selectors
export const selectStatus = (state:any) => state.status