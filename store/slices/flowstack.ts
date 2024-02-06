import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "."

type screen_in_stack = 'search' | 'booking-confirmation' | 'map' | 'history' | 'upcoming' | 'upcoming-reservation-details' | 'upcoming-vehicle-inspection' | 'profile' | 'edit' | 'payment-details' | 'mpesa-details' | 'add-card' | 'settings' | 'driver-license' | 'about' | 'privacy-policy' | 'user-agreement' | 'profile-support' | 'manage-reservations' | 'res-booking-details' | 'issues' | 'booking-details' | 'reservation-details' | 'vehicle-inspection' | 'login' | 'register' | 'forgot-password' | 'confirmation-sent' | 'verification' | 'change-password' | 'support' | 'onboarding' | 'drivers-license' | 'location' | 'select-payment-method' | 'selected-payment-method'
type flow_names = 'notification_enable' | 'add_payment_method' | 'authcode'



const flowSlice = createSlice({
    name: 'flowstack',
    initialState: {
        current_flow: null as null | flow_names,
    },
    reducers: {
        setFlow: (state, action) => {
            state.current_flow = action.payload
        }
    }
})

export const { setFlow } = flowSlice.actions

export default flowSlice.reducer

export type { screen_in_stack, flow_names }

export const selectCurrentFlow = (state: RootState) => state.flowstack.current_flow