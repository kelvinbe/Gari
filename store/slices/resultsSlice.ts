import { createSlice } from "@reduxjs/toolkit";

interface VehiclePic {
    id: string;
    picUrl: string;
}

interface Result {
    hostId: string;
    hostPicUrl: string;
    vehicleId: string;
    vehicleMake: string;
    vehicleModel: string;
    vehiclePics: VehiclePic[];
    distance: string;
    hourlyRate: string;
    x_cord: string;
    y_code: string;
}

const initialState: {
    startDateTime: string;
    endDateTime: string;
    marketId: number | null,
    x_cord: string;
    y_cord: string;
    results: Result[]
} = {
    startDateTime: "",
    endDateTime: "",
    marketId: null,
    x_cord: "",
    y_cord: "",
    results: []
}

const resultsSlice = createSlice({
    name: "searchSlice",
    initialState: initialState,
    reducers: {
        setResults: (state, action) => {
            state.results = action.payload.results
        }
    }
})

export default resultsSlice.reducer;

// actions
export const { setResults } = resultsSlice.actions;

// selectors
export const selectResults = (state: any) => state.results;