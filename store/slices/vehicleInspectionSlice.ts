import { createSlice } from "@reduxjs/toolkit";
import { vehicleInspection } from "../../types";


const initialState: {
    vehicleInspectionData: vehicleInspection[]
} = {
    vehicleInspectionData: []
}

const vehicleInspectionSlice = createSlice({
    name: "vehicleInspectionSlice",
    initialState: initialState,
    reducers: {
        setVehicleInspectionData: (state, action) => {
            state.vehicleInspectionData = action.payload.vehicleInspectionData
        }
        
    }
})

export default vehicleInspectionSlice.reducer;

// actions
export const { setVehicleInspectionData } = vehicleInspectionSlice.actions;

// selectors
export const selectVehicleInspection = (state: any) => state.vehicleInspectionData;