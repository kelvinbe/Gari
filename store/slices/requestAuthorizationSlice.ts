import { createSlice } from "@reduxjs/toolkit";


const initialState: {
    requestAuthCode: boolean
} = {
    requestAuthCode: false
}

const requestAuthorizationCode = createSlice({
    name: 'requestAuthCode',
    initialState: initialState,
    reducers: {
        setRequestAuthCode: (state) => {
            state.requestAuthCode = true
        }
    }
})


export default requestAuthorizationCode.reducer

//actions
export const {setRequestAuthCode} = requestAuthorizationCode.actions

//selectors
export const selectRequestAuthCode = (state: any) => state.requestAuthCode