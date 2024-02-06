import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as Location from 'expo-location'
import { RootState } from ".";
import { clearBookingState } from "./bookingSlice";
import { AxiosError } from "axios";

export const searchLocally = createAsyncThunk('search/searchLocally', async (data,{rejectWithValue, dispatch})=>{
    dispatch(clearBookingState())
    try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            return rejectWithValue('Permission to access location was denied')
        }
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
        })

        return location.coords
    } catch (e) {
        return rejectWithValue((e as AxiosError)?.response?.data ?? "An error occured")
    }   
})


interface ReducerState {
    coords: Location.LocationObjectCoords | null
    loadingCoords: boolean
    errorCoords: string | null,
    vehicle_positions: Array<Partial<Location.LocationObjectCoords>>
}

const initialState: ReducerState = {
    coords: null,
    loadingCoords: false,
    errorCoords: null,
    vehicle_positions: []
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setVehiclePositions: (state, action) => {
            state.vehicle_positions = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(searchLocally.pending, (state, action) => {
            state.loadingCoords = true
            state.errorCoords = null
        })
        builder.addCase(searchLocally.fulfilled, (state, action) => {
            state.coords = action.payload ?? null
            state.loadingCoords = false
        })
        builder.addCase(searchLocally.rejected, (state, action) => {
            state.coords = null
            state.loadingCoords = false
            state.errorCoords = action.payload as string
        })
    }
})

export default searchSlice.reducer;

export const { setVehiclePositions } = searchSlice.actions


export const selectCoords = (state: RootState) => {
    return {
        data: state.search.coords,
        loading: state.search.loadingCoords,
        error: state.search.errorCoords
    }
}

export const selectVehiclePositions = (state: RootState) => {
    return {
        data: state.search.vehicle_positions ?? []
    }
}