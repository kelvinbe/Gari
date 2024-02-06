import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import bookingSlice from './bookingSlice';
import errorSlice from './errorSlice';
import historySlice, { historyApi } from './historySlice';
import issuesSlice from './issuesSlice';
import navigationSlice from './navigationSlice';
import reservationSlice, { reservationsApi } from './reservationSlice';
import notificationsSlice from './notificationsSlice';
import paymentsSlice from './paymentsSlice';
import resultsSlice from './resultsSlice';
import userSlice from './userSlice';
import { vehiclesApi } from './vehiclesSlice';
import { billingApi } from './billingSlice';
import upcomingReservationSlice from './upcomingReservationSlice';
import addCardSlice from './addCardSlice';
import deleteCardSlice from './deleteCardSlice';
import startReservationSlice from './startReservationSlice';
import vehiclesSlice from './vehiclesSlice';
import onBoardingSlice, { onBoardingApi } from './onBoardingSlice';
import paymentMethodSlice from './paymentMethodSlice';
import searchSlice from './searchSlice';
import mapBottomSheet from './mapBottomSheet';
import settingsSlice from './settingsSlice';
import flowstack from './flowstack';

const rootReducer = combineReducers({
  auth: authSlice,
  [billingApi.reducerPath]: billingApi.reducer,
  booking: bookingSlice,
  error: errorSlice,
  history: historySlice,
  [historyApi.reducerPath]: historyApi.reducer, 
  issues: issuesSlice,
  navigation: navigationSlice,
  notifications: notificationsSlice,
  reservation: reservationSlice,
  [reservationsApi.reducerPath]: reservationsApi.reducer,
  payments: paymentsSlice,
  results: resultsSlice,
  user: userSlice,
  [vehiclesApi.reducerPath]: vehiclesApi.reducer,
  upcoming:upcomingReservationSlice,
  addCard: addCardSlice,
  deleteCard: deleteCardSlice,
  startReservation: startReservationSlice,
  vehicles: vehiclesSlice,
  onboarding: onBoardingSlice,
  [onBoardingApi.reducerPath]: onBoardingApi.reducer,
  paymentMethodSlice: paymentMethodSlice,
  search: searchSlice,
  mapBottomSheet: mapBottomSheet,
  settings: settingsSlice,
  flowstack: flowstack,
});

export default rootReducer;

//types 
export type RootState = ReturnType<typeof rootReducer>;
