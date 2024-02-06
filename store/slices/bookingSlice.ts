import { IPayment, IPaymentMethod, IPaymentType, IReservation, Inspection, InspectionQuestion } from './../../types';
import { RootState } from './index';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IVehicle } from "../../types";
import { first, isNull } from 'lodash';
import apiClient from '../../utils/apiClient';
import { RESERVATIONS_ENDPOINT } from '../../hooks/constants';
import { calcDuration } from '../../utils/utils';
import { LocationObject } from 'expo-location';
import { AxiosError } from 'axios';


/**
 * @name loadBookingDetailsFromReservation
 * @description, when the user presses on a reservation in the ManageRes screen or History Screen, we need to load the booking details from the reservation,
 *               so that the user can see the booking details and make changes to the booking if they want to
 */
export const loadBookingDetailsFromReservation = createAsyncThunk<any, any>(
    "booking/loadBookingDetailsFromReservation",
    (id: string, {rejectWithValue}) => {
        return apiClient.get(RESERVATIONS_ENDPOINT, {
            params: {
                reservation_id: id
            }
        }).then(({data})=>first(data)).catch((e: AxiosError)=>rejectWithValue(e?.response?.data ?? "An error occured"))
    }
)

/**
 * @name modifyCurrentReservation
 * @description update the start or end time of the reservation being edited
 */
export const modifyCurrentReservation = createAsyncThunk('booking/modifyCurrentReservation', (data: Partial<IReservation>, {rejectWithValue, dispatch, getState})=>{
    const {booking} = getState() as RootState
    return apiClient.patch(RESERVATIONS_ENDPOINT, data, {
        params: {
            reservation_id: booking.reservation_id
        }
    }).then(({data})=>{
        dispatch(loadBookingDetailsFromReservation(data.id))
        return data
    }).catch((e: AxiosError)=>rejectWithValue(e?.response?.data ?? "An error occured"))
})

/**
 * @name updateInspection 
 * @description update the inspection of the reservation being edited
 */
export const updateInspection = createAsyncThunk('booking/updateInspection', (data: {questions: InspectionQuestion[], fuel?: number}, {rejectWithValue, dispatch, getState})=>{
    const state = getState() as RootState
    const {booking : {reservation_id}} = state
    return apiClient.patch(`${RESERVATIONS_ENDPOINT}/inspection`, data, {
        params: {
            reservation_id
        }
    }).then(()=>{
        
        dispatch(loadBookingDetailsFromReservation(reservation_id))
        return null
    }).catch((e: AxiosError)=>rejectWithValue(e?.response?.data ?? "An error occured"))
})



export type tNotification = {
    vehicle_id: string,
    code: string,
    host_id: string
}

const initialState: {
    status: string,
    /**
     * The authcode provided to the user by the host, is a requirement for booking
     */
    code: string | null,
    rate: string | null,
    tax: string | null,
    total: string | null,
    vehicle: IVehicle | null,
    /**
     * a utc date string representing pickup time, something like 2021-01-01T00:00:00.000Z
     */
    start_date_time: string,
    /**
     * a utc date string representing dropoff time, something like 2021-01-01T00:00:00.000Z
     */
    end_date_time: string,
    duration: number,
    locationId: number | null, // will be phased out in favout of location object
    host_id: string | null,// will be phased out in favour of host_code
    /**
     * Billing info is the payment method selected by the user is a requirement for booking
     */
    billingInfo: IPaymentMethod<any> | null, // this will be phased out in favour of paymentDetails and payment type
    /**
     * 0 = cannot book
     * 1 = one of the checks either authCode or billingInfo is missing
     * 2 = both checks are present so the booking can be made
     */
    canBookChecks: number,
    notification: tNotification | null,
    modifyReservationLoading: boolean,
    modifyReservationError: string | null,
    paymentDetails: IPayment | null,
    paymentType: IPaymentType | null,
    reservation_id?: string,
    loadReservationDetailsLoading: boolean,
    loadReservationDetailsError: string | null,
    location: LocationObject | null,
    host_code: string,
    inspection: Inspection | null,
    inspectionUpdateLoading: boolean,
    inspectionUpdateError: string | null,
    /**
     * When a payment request is made, the user receives back an payment identifier called a payment authorization, these payment authorizations
     * are then used to confirm if payments were successful, this is because other than stripe, which can be directly embeded into react native
     * we have to use polling to validate payment from the backend for other payment providers
     */
    booking_payment_authorization: string | null
    /**
     * e.g CASH / STRIPE / PAYPAL / MPESA / MTN
     */
    reservation_payment_method: string | null
} = {
    status: 'Incomplete',
    code: null,
    rate: null,
    tax: null,
    total: null,
    vehicle: null,
    start_date_time: "",
    end_date_time: "",
    duration: 1,
    locationId: null,
    host_id: null,
    billingInfo: null,
    canBookChecks: 0,
    notification: null,
    modifyReservationLoading: false,
    modifyReservationError: null,
    paymentDetails: null,
    paymentType: null,
    loadReservationDetailsLoading: false,
    loadReservationDetailsError: null,
    host_code: '',
    location: null,
    inspection: null,
    inspectionUpdateError: null,
    inspectionUpdateLoading: false,
    booking_payment_authorization: null,
    reservation_payment_method: null
}

const bookingSlice = createSlice({
    name: "bookingSlice",
    initialState: initialState,
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload.status
        },
        setAuthCode: (state, action) => {
            state.code = action.payload.authCode
            state.canBookChecks = state.code ?state.canBookChecks + 1 : state.canBookChecks - 1
        },
        setStartDateTime: (state, action) => {
            state.start_date_time = action.payload.startDateTime
        },
        setEndDateTime: (state, action) => {
            state.end_date_time = action.payload.endDateTime
        },
        setHostId: (state, action) => {
            state.host_id = action.payload.hostId
        },
        setVehicle: (state, action) => {
            state.vehicle = action.payload.vehicle
            /**
             * @todo - on mock data update, change vehicle_id to vehicle.id
             */
            if (!isNull(state.notification) && action.payload.vehicle?.vehicle_id === state.notification?.vehicle_id) {
                state.code = state.notification.code
                state.host_id = state.notification.host_id
            }
        },
        setBillingInfo: (state, action) => {
            state.billingInfo = action.payload.billingInfo
            state.canBookChecks = state.billingInfo ?state.canBookChecks + 1 : state.canBookChecks - 1
        },
        setPaymentType: (state, action)=>{
            state.paymentType = action.payload
        },
        clearBookingState: (state)=>{
            state.status = 'Incomplete'
            state.code = null
            state.rate = null
            state.tax = null
            state.total = null
            state.vehicle = null
            state.duration = 1
            state.locationId = null
            state.host_id = null
            state.billingInfo = null
            state.canBookChecks = 0
            state.notification = null
            state.modifyReservationLoading = false
            state.modifyReservationError = null
            state.paymentDetails = null
            state.paymentType = null
            state.loadReservationDetailsLoading = false
            state.loadReservationDetailsError = null
            state.location = null
            state.inspection = null
            state.reservation_id = undefined
            state.reservation_payment_method = null
        },
        setNotification: (state, action)=>{
            state.notification = action.payload
        },
        setHostCode: (state, action)=>{
            state.host_code = action.payload?.trim() ?? ''
        },
        setLocation: (state, action)=>{
            state.location = action.payload
        },
        setBookingPaymentAuthorization: (state, action)=>{
            state.booking_payment_authorization = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(loadBookingDetailsFromReservation.fulfilled, (state, action)=>{
            const data = action.payload as IReservation 
            // state.billingInfo = action.payload?.paymentMethod as any
            state.paymentDetails = data?.payment
            state.paymentType = data?.payment?.payment_type ?? null
            state.end_date_time = data?.end_date_time as any
            state.total = ((data.vehicle.hourly_rate ?? 0)  * calcDuration(data.start_date_time, data.end_date_time)).toString()
            state.start_date_time = action.payload?.start_date_time as any
            state.status = action.payload?.status as any
            state.vehicle = action.payload?.vehicle as any
            state.canBookChecks = 2
            state.reservation_id = data?.id
            state.status = data?.status ?? "UPCOMING"
            state.inspection = data?.inspection
            state.loadReservationDetailsLoading = false
            state.loadReservationDetailsError = null
            state.reservation_payment_method = data?.payment_method
        })
        builder.addCase(loadBookingDetailsFromReservation.pending, (state, action)=>{
            state.loadReservationDetailsLoading = true
            state.loadReservationDetailsError = null
        })
        builder.addCase(loadBookingDetailsFromReservation.rejected, (state, action)=>{
            state.loadReservationDetailsLoading = false
            state.loadReservationDetailsError = action.error.message ?? null
        })
        builder.addCase(modifyCurrentReservation.pending, (state, action)=>{
            state.modifyReservationLoading = true
            state.modifyReservationError = null
        })
        builder.addCase(modifyCurrentReservation.fulfilled, (state, action)=>{
            state.modifyReservationLoading = false
            state.modifyReservationError = null
        })
        builder.addCase(modifyCurrentReservation.rejected, (state, action)=>{
            state.modifyReservationLoading = false
            state.modifyReservationError = action.error.message ?? null
        })
        builder.addCase(updateInspection.pending, (state, action)=>{
            state.inspectionUpdateLoading = true
            state.inspectionUpdateError = null
        })
        builder.addCase(updateInspection.fulfilled, (state, action)=>{
            state.inspectionUpdateLoading = false
            state.inspectionUpdateError = null
        })
        builder.addCase(updateInspection.rejected, (state, action)=>{
            state.inspectionUpdateLoading = false
            state.inspectionUpdateError = action.error.message ?? null
        })
    },
})

export default bookingSlice.reducer;

// actions
export const {
    setStatus,
    setAuthCode,
    setStartDateTime,
    setEndDateTime,
    setHostId,
    setVehicle,
    setBillingInfo,
    clearBookingState,
    setNotification,
    setPaymentType,
    setHostCode,
    setLocation,
    setBookingPaymentAuthorization
} = bookingSlice.actions;

// selectors
export const selectAuthenticated = (state: any) => state.authenticated;

export const  selectBookingData = (state: RootState) => state.booking;

export const selectStartDateTime = (state: RootState) => state.booking.start_date_time

export const selectEndDateTime = (state: RootState) => state.booking.end_date_time

export const selectModifyReservationFeedback = (state: RootState) => ({
    loading: state.booking.modifyReservationLoading,
    error: state.booking.modifyReservationError
})

export const selectLoadReservationDetailsFeedback = (state: RootState) => ({
    loading: state.booking.loadReservationDetailsLoading,
    error: state.booking.loadReservationDetailsError
})

export const selectUsersLocation =  (state: RootState) => state.booking.location 


export const selectChosenHostCode = (state: RootState) => state.booking.host_code

export const selectUpdateInspectionFeedback = (state: RootState) => ({
    loading: state.booking.inspectionUpdateLoading,
    error: state.booking.inspectionUpdateError
})

export const selectBookingPaymentAuthorization = (state: RootState) => state.booking.booking_payment_authorization