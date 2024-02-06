import { IVehicle } from './../../types';
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DOMAIN, VEHICLES_ENDPOINT } from '../../hooks/constants';
import { app, auth } from '../../firebase/firebaseApp';
import { createSlice } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';


export const vehiclesApi = createApi({
    reducerPath: "vehiclesApi",
    baseQuery: fetchBaseQuery({ 
        prepareHeaders: async (headers ) => {
            await getAuth(app).currentUser?.getIdToken().then((token)=>{
                headers.set('Authorization', `Bearer ${token}`)
                headers.set('x-user', `CUSTOMER`)
            })
        }
     }),
    endpoints: (builder) => ({
        getVehicles: builder.query<IVehicle[], {
            vehicle_id?: string,
            start_date_time?: string,
            end_date_time?: string,
            page?: string,
            size?: string,
            longitude?: string,
            latitude?: string,
            host_code?: string,
        }>({
            query: (params) => ({
                method: "GET",
                url: VEHICLES_ENDPOINT,
                params
            }),
            transformResponse: (response: any) => {
                return response.data as IVehicle[]
            },
            transformErrorResponse: (response) => {
                return response
            }
        }),
        getVehicle: builder.query<Partial<IVehicle>, string|undefined>({
            query: (id) => ({
                method: "GET",
                url: VEHICLES_ENDPOINT,
                params: {
                    vehicle_id: id
                }
            }),
            transformResponse: (response: any) => {
                return response?.data?.[0] as Partial<IVehicle> ?? null
            }
        })
    }),
    
})


export const { useGetVehiclesQuery, useGetVehicleQuery } = vehiclesApi


const initialState: {
    vehicleData: IVehicle[],
} = {
    vehicleData: [],
}



const vehicleDataSlice = createSlice({
    name: "vehicleData",
    initialState,
    reducers: {
        setGetVehicleData:(state, action) => {
            state.vehicleData = action.payload.vehicleData
        },

    },
})

export default vehicleDataSlice.reducer;

export const {setGetVehicleData} = vehicleDataSlice.actions

export const selectVehicleData = (state:any) => state.vehicles.vehicleData


export const selectVehicles = vehiclesApi.endpoints.getVehicles.select
