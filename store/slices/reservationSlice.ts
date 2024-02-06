import { IAPIDto, IReservation, IVehicle} from './../../types';
import { DOMAIN, RESERVATIONS_ENDPOINT } from './../../hooks/constants';
import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { createSlice } from '@reduxjs/toolkit';
import { auth } from '../../firebase/firebaseApp';


export const reservationsApi = createApi({
    reducerPath: "reservationsApi",
    baseQuery: fetchBaseQuery({
        prepareHeaders: async (headers) =>{
            const token = await auth.currentUser?.getIdToken()
            headers.set('Authorization', `Bearer ${token}`)
            headers.set('x-user', 'CUSTOMER')
            return headers
        }
    }),
    endpoints: (builder) => ({
        getReservations: builder.query<IReservation[], {status?: string, page?: number, size?: number} | undefined>({
            query: (params) => ({
                url: RESERVATIONS_ENDPOINT,
                method: 'GET',
                params
            }),
            transformResponse: (response: any) => {
                return response.data
            }  
        }),
        getReservation: builder.query<IReservation, string>({
            query: (id: string) =>({
                url: RESERVATIONS_ENDPOINT,
                method: 'GET',
                params: {
                    reservation_id: id
                }
            }),
            transformResponse: (response: any) => {
                // this will use the same handler on as the getReservations endpoint on the backend,
                // the handler will combine all the info related to the reservation and return it as a single object
                return response.data?.[0] ?? null
            }
        }),
        addReservation: builder.mutation<Partial<IReservation>, {
            body: Partial<IReservation> & Partial<IVehicle>,
            headers: string
        }>({
            query: (data) => ({
                url: RESERVATIONS_ENDPOINT,
                method: 'POST',
                body: data.body,
                headers: {
                    "X-Payment-Authorization": data.headers
                }
            }),
            transformResponse: (response: any) => {
                return response.data
            }
        }),
    })
})

export const { useGetReservationsQuery, useGetReservationQuery, useAddReservationMutation } = reservationsApi

interface IReservationState {
    chosenReservation?: string,
    modifyReservation?:boolean,
    extendReservation?:boolean
}

const initialState: IReservationState = {
    chosenReservation: undefined,
    modifyReservation:false,
    extendReservation:false
}

const reservationSlice = createSlice({
    name: 'reservationSlice',
    initialState,
    reducers: {
        setChosenReservation: (state, action) => {
            state.chosenReservation = action.payload;
        },
        setModifyReservation: (state) => {
            state.modifyReservation = true
        },
        setExtendReservation: (state) => {
            state.extendReservation = true
        },
    }
})

export default reservationSlice.reducer;

// actions

export const { setChosenReservation, setModifyReservation, setExtendReservation } = reservationSlice.actions;

// selectors
export const selectChosenReservation = (state: any) => state.reservation.chosenReservation;