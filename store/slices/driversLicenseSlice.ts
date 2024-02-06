import { createSlice } from "@reduxjs/toolkit";

interface IProps {
    driversLicenseUrl:string;
}

const initialState: IProps = {
    driversLicenseUrl:'',
};
const driversLicenseSlice = createSlice({
    name: 'driversLicenseSlice',
    initialState,
    reducers: {
    setDriversLicenseUrl: (state, action) => {
        state.driversLicenseUrl = action.payload.driversLicenseUrl;
    },
    editDriversLicenseUrl: (state, action) => {
        state.driversLicenseUrl = action.payload.driversLicenseUrl;
    }
},
});

//actions
export const { setDriversLicenseUrl, editDriversLicenseUrl } = driversLicenseSlice.actions;

//reducer
export default driversLicenseSlice.reducer;


export const selectDriversLicense = (state: any) => state.driversLicense