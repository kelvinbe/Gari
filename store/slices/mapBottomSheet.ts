import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { tNotification } from './bookingSlice';

const initialState = {
  open: false,
  upcoming: true,
  current: false,
  authorizationOpen: false,
  paymentOpen: false,
  modifyBooking: false,
  cancelBooking: false,
  chooseTime: false,
  notification: null as (Partial<tNotification> | null)
};

const mapBottomSheet = createSlice({
  name: 'mapBottomSheet',
  initialState,
  reducers: {
    openAuthorizationCode: (state) => {
      state.authorizationOpen = true;
    },
    openSelectPaymentMethod: (state) => {
      state.paymentOpen = true;
    },
    startedJourney: (state) => {
      state.upcoming = false;
      state.current = true;
    },
    closeAuthorizationBottomSheet: (state) => {
      state.authorizationOpen = false;
    },
    closePaymentBottomSheet: (state) => {
      state.paymentOpen = false;
    },
    openBottomSheet: (state) => {
      state.open = true;
    },
    closeBottomSheet: (state) => {
      state.open = false;
    },
    modifyBooking: (state) => {
      state.modifyBooking = true;
    },
    cancelBooking: (state) => {
      state.cancelBooking = true;
    },
    closeModifyBooking: (state) => {
      state.modifyBooking = false;
    },
    closeCancelBooking: (state) => {
      state.cancelBooking = false;
    },
    openChooseTime: (state) => {
        state.chooseTime = true;
    },
    closeChooseTime: (state) => {
        state.chooseTime = false;
    },
    setBottomSheetNotification: (state, action) => {
        state.notification = action.payload;
    },
    openChooseTimeAndBottomSheet: (state) => {
        state.chooseTime = true;
        state.open = true;
        state.authorizationOpen = false;
        state.paymentOpen = false;
        state.modifyBooking = false;
        state.cancelBooking = false;
        // state.notification = null;
    }
  },
});

export const {
  openAuthorizationCode,
  openSelectPaymentMethod,
  startedJourney,
  closeAuthorizationBottomSheet,
  closePaymentBottomSheet,
  openBottomSheet,
  closeBottomSheet,
  modifyBooking,
  cancelBooking,
  closeModifyBooking,
  closeCancelBooking,
  openChooseTime,
  closeChooseTime,
  setBottomSheetNotification,
    openChooseTimeAndBottomSheet
} = mapBottomSheet.actions;

export default mapBottomSheet.reducer;


export const selectBottomSheetState = (state: RootState) => state.mapBottomSheet;
