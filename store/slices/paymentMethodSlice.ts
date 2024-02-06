import { createSlice } from "@reduxjs/toolkit";
import { IPaymentMethod } from "../../types";
import { RootState } from './index';




const initialState: {
    paymentMethods: IPaymentMethod<any>[]
    selectedType: string
} = {
    paymentMethods: [],
    selectedType: ''
}



const paymentMethodsSlice = createSlice({
    name: "paymentMethodsSlice",
    initialState: initialState,
    reducers: {
        setPaymentMethods: (state, action) => {
            state.paymentMethods = action.payload.paymentMethods
        },
        setSelectedType: (state, action) => {
            state.selectedType = action.payload
        }
    }
})


export default paymentMethodsSlice.reducer;


// actions
export const {setPaymentMethods, setSelectedType} = paymentMethodsSlice.actions


// selectors
export const selectedPaymentMethod = (state: any) => state.paymentMethods
export const selectedType = (state: RootState) => state.paymentMethodSlice.selectedType







