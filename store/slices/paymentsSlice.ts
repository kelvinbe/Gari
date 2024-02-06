import { createSlice } from "@reduxjs/toolkit";

interface Payment {
    paymentId: string;
    paymentMethod: string;
    amount: string;
    reservationId: string;
    dateTime: string;
    statue: string;
}

const initialState: {
    payments: Payment[]
} = {
    payments: []
}

const paymentsSlice = createSlice({
    name: "paymentsSlice",
    initialState: initialState,
    reducers: {
        setPayments: (state, action) => {
            state.payments = action.payload.payments
        }
    }
})

export default paymentsSlice.reducer;

// actions
export const { setPayments } = paymentsSlice.actions;

// selectors
export const selectPayments = (state: any) => state.payments;