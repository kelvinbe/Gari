import { vehiclesApi } from './slices/vehiclesSlice';
import { historyApi } from './slices/historySlice';
// import LogRocket from '@logrocket/react-native';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import rootReducer, { RootState } from './slices';
import { reservationsApi } from './slices/reservationSlice';
import { billingApi } from './slices/billingSlice';
import { onBoardingApi } from './slices/onBoardingSlice';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
  .concat(historyApi.middleware)
  .concat(reservationsApi.middleware)
  .concat(vehiclesApi.middleware)
  .concat(billingApi.middleware)
  .concat(onBoardingApi.middleware)
  ,
  // middleware: [
  //   LogRocket.reduxMiddleware(),
  // ]
});

export default store;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
