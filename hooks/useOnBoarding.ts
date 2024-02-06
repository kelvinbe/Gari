import { isEmpty, isNull } from 'lodash';
import { useEffect, useState } from 'react';
import {
  resetOnboarding,
  selectOnBoardingCompleted,
  selectOnBoardingDriversLicense,
  selectOnBoardingFetchState,
  selectOnBoardingLocation,
  selectOnBoardingPaymentMethod,
  setOnBoarding,
  setOnBoardingDriversLicenseBack,
  setOnBoardingDriversLicenseFront,
  setOnBoardingLocation,
  setOnBoardingPaymentMethod,
  useAddOnboardingPaymentMethodMutation,
  useGetOnboardingQuery,
  useUpdateDriverCredentialsMutation,
  useUpdateOnboardinProfileMutation,
} from '../store/slices/onBoardingSlice';
import { selectStripeCustomerId } from '../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import { PaymentDetails } from '../types';

function useOnBoarding() {
  
  const [
    updateDriverCredentials,
    { isLoading: isUpdatingLicense, isError: updateLicenseError },
  ] = useUpdateDriverCredentialsMutation();

  const [
    updateProfile,
    { isLoading: isUpdatingProfile, isError: updateProfileError },
  ] = useUpdateOnboardinProfileMutation();

  const [
    addPaymentMethod,
    { isLoading: isAddingPaymentMethod, isError: addPaymentMethodError },
  ] = useAddOnboardingPaymentMethodMutation();

  

  const dispatch = useAppDispatch();
  const completed = useAppSelector(selectOnBoardingCompleted);
  const driversLicense = useAppSelector(selectOnBoardingDriversLicense);
  const paymentMethod = useAppSelector(selectOnBoardingPaymentMethod);
  const location = useAppSelector(selectOnBoardingLocation);
  const customer_id = useAppSelector(selectStripeCustomerId);
  const fetchState = useAppSelector(selectOnBoardingFetchState)


  /**
   * @name resetOnBoarding
   * @description resets the onboarding state
   */
  function _resetOnBoarding() {
    dispatch(resetOnboarding());
  }

  /**
   * @name setLicence
   * @description sets the drivers license
   */
  function _setLicence(license: string, side: 'front' | 'back') {
    if (side === 'front') {
      dispatch(
        setOnBoardingDriversLicenseFront(license)
      );
    }else if(side === 'back'){
      dispatch(
        setOnBoardingDriversLicenseBack(license)
      );
    }
  }

  /**
   * @name setPaymentMethod
   * @description sets the payment method
   */
  function _setPaymentMethod(paymentMethod: { type: string; details?: Partial<PaymentDetails> | null}) {
    dispatch(setOnBoardingPaymentMethod(paymentMethod));
  }
  /**
   * @name setLocation
   * @description sets the location
   */
  function _setLocation(location: any) {
    dispatch(setOnBoardingLocation(location));
  }

  /**
   * @name setCompleted
   * @description sets the completed object
   */
  function _setCompleted(completed: {
    drivers_license?: boolean;
    payment_method?: boolean;
    location?: boolean;
  }) {

    if(completed?.drivers_license){
      updateDriverCredentials({ drivers_license: driversLicense });
    }else if(completed?.payment_method){
      // this has been localized to the individual formas
    }else if(completed?.location){
      updateProfile({
        market_id: location.market_id,
        sub_market_id: location.sub_market_id,
      });
    }
    dispatch(setOnBoarding(completed));
  }

  return {
    completed,
    driversLicense,
    paymentMethod,
    resetOnBoarding: _resetOnBoarding,
    setLicence: _setLicence,
    setPaymentMethod: _setPaymentMethod,
    setCompleted: _setCompleted,
    setLocation: _setLocation,
    isUpdatingLicense,
    updateLicenseError,
    loading: fetchState.loading,
    error: fetchState.error,
  };
}

export default useOnBoarding;
