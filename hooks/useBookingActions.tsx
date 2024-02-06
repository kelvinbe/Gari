import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native'
import React, { useState } from 'react'
import { selectBookingData, setAuthCode, setBillingInfo, setEndDateTime, setHostId, setStartDateTime, setStatus, setVehicle, clearBookingState, setPaymentType, selectBookingPaymentAuthorization, setBookingPaymentAuthorization } from '../store/slices/bookingSlice'
import { selectStripeCustomerId, selectUserProfile } from '../store/slices/userSlice'
import { useAppDispatch, useAppSelector } from '../store/store'
import { IPaymentMethod, IReservation } from '../types'
import { calcDuration } from '../utils/utils'
import { BACKEND_DOMAIN, PAYMENT_ENDPOINT, RESERVATIONS_ENDPOINT } from './constants'
import useToast from './useToast'
import apiClient from '../utils/apiClient'
import * as Linking from 'expo-linking'



function useBookingActions() {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [paymentOption, setPaymentOption] = useState<any>(null)
    const toast = useToast()

    const reduxDispatch = useAppDispatch()
  // Selectors
    const bookingDetails = useAppSelector(selectBookingData)
    const customerId = useAppSelector(selectStripeCustomerId)
    const user = useAppSelector(selectUserProfile)
    const booking_payment_authorization = useAppSelector(selectBookingPaymentAuthorization)

    //Actions
    const _setStatus = (status: any) => reduxDispatch(setStatus({status}))
    const _setAuthCode = (authCode: any) => reduxDispatch(setAuthCode({authCode}))
    const _setStartDateTime = (startDateTime: any) => reduxDispatch(setStartDateTime({startDateTime}))
    const _setEndDateTime = (endDateTime: any) => reduxDispatch(setEndDateTime({endDateTime}))
    const _setHostId = (hostId: any) => reduxDispatch(setHostId({hostId}))
    const _setVehicle = (vehicle: any) => reduxDispatch(setVehicle({vehicle}))
    const _setBillingInfo = (billingInfo: IPaymentMethod<any>) => reduxDispatch(setBillingInfo({billingInfo}))
    const _clearBookingState = () => reduxDispatch(clearBookingState())
    const _setPaymentType = (paymentType: any) => reduxDispatch(setPaymentType(paymentType))
    const clearBookingOption = () => setPaymentOption(null)



    /**
     * @name payWithStripe
     * @description - handle's stripe payments
     */
    const payWithStripe = async () => {
      const { vehicle, start_date_time, end_date_time } = bookingDetails
      setLoading(true)
      apiClient.post(`${PAYMENT_ENDPOINT}`, {
        amount: Number(((vehicle?.hourly_rate ?? 0) * calcDuration(start_date_time, end_date_time)).toFixed()) * (
          ['RWF']?.includes(vehicle?.host?.market?.currency ?? "USD") ? 1 : // rwf is a zero decimal currency
          100
        ),
        currency: vehicle?.host?.market?.currency ?? 'USD',
        payment_method: bookingDetails?.paymentType?.stripe_payment_method_id,
        reservation_id: bookingDetails?.reservation_id
      }).then(({data})=>{
        return initPaymentSheet({
            paymentIntentClientSecret: data.client_secret,
            merchantDisplayName: "divvly",
            customerId: user?.customer_id ?? undefined,
            customerEphemeralKeySecret: data.ephemeralKey
        }).then(()=>{
            return presentPaymentSheet().then((rs)=>{
              if(rs.error){
                  setLoading(false)
              }
              setPaymentOption({
                payment_method: 'stripe',
              })
              reduxDispatch(setBookingPaymentAuthorization(data?.authorization))
              setLoading(false)
                
            }).catch((e)=>{
              setLoading(false)
              setError(e)
              toast({
                message: "An error Occured",
                type: "error",
                duration: 3000,
                title: "Error"
              })
                console.log(e)
            })
        }).catch((e)=>{
            setLoading(false)
            setError(e)
            console.log(e)
            toast({
                message: "An error Occured",
                type: "error",
                duration: 3000,
                title: "Error"
            })
        })
      }).catch((e)=>{
          setLoading(false)
            setError(e)
            console.log(e)
            toast({
                message: "An error Occured",
                title: "Error",
                type: "error",
                duration: 4000
            })
      })
    }

    /**
     * @name payWithMpesa
     * @description - handle's mpesa payments
     */
    const payWithMpesa = async () => {
      setLoading(true)
      const { vehicle, start_date_time, end_date_time, paymentType } = bookingDetails
      await apiClient.post(`${PAYMENT_ENDPOINT}/mpesa`, {
        amount: Number(((vehicle?.hourly_rate ?? 0) * calcDuration(start_date_time, end_date_time)).toFixed()),
        vehicle_id: vehicle?.id,
        payment_type_id: paymentType?.id,
        reservation_id: bookingDetails?.reservation_id
      }).then(({data})=>{
        setPaymentOption({payment_method: 'mpesa'})
        // set the payment authorization code
        reduxDispatch(setBookingPaymentAuthorization(data.authorization))
      }).catch((e)=>{
        setError(e)
        toast({
          message: "An error Occured",
          title: "Error",
          type: "error",
          duration: 4000
        })
      }).finally(()=>{
        setLoading(false)
      })
    }

    /**
     * @name payWithMtn 
     * @description - handle's mtn payments
     */
    const payWithMtn = async () => {
      setLoading(true)
      const { vehicle, start_date_time, end_date_time } = bookingDetails

      await apiClient.post(`${PAYMENT_ENDPOINT}/mtn`, {
        amount: Number(((vehicle?.hourly_rate ?? 0) * calcDuration(start_date_time, end_date_time)).toFixed()),
        vehicle_id: vehicle?.id,
        payment_type_id: bookingDetails?.paymentType?.id,
        reservation_id: bookingDetails?.reservation_id
      }).then(({data})=>{
          setPaymentOption({payment_method: 'mtn'})
          // set the payment authorization code 
          reduxDispatch(setBookingPaymentAuthorization(data.authorization))
      }).catch((e)=>{   
        setError(e)
        toast({
          message: "An error Occured",
          title: "Error",
          type: "error",
          duration: 4000
        })
      }).finally(()=>{
        setLoading(false)
      })

    }

    /**
     * @name payWithCash
     */

    const payWithCash = async () =>{
      const { vehicle, start_date_time, end_date_time } = bookingDetails 
      setLoading(true)
      try{
        const reservation = (await apiClient.post(`${RESERVATIONS_ENDPOINT}/cash`, {
          start_date_time,
          end_date_time,
          amount: Number(((vehicle?.hourly_rate ?? 0) * calcDuration(start_date_time, end_date_time)).toFixed()),
          vehicle_id: vehicle?.id
        })).data as Partial<IReservation>

        Linking.openURL(Linking.createURL("/booking-confirmation", {
          queryParams: {
            reservationId: reservation?.id
          }
        }))
      }
      catch (e)
      {
        setError(e as string)
        toast({
          message: "An error Occured",
          title: "Error",
          type: "error",
          duration: 4000
        })
      }
      finally{
        setLoading(false)
      }
    }

    /**
     * @name payForReservation
     * @description This function is used to pay for the reservation
     * @param {string} paymentMethodId - The payment method id
     */

    const payForReservation = async () => {
      switch(bookingDetails?.paymentType?.type){
        case 'STRIPE':
          await payWithStripe() 
          break;
        case 'MPESA':
          await payWithMpesa()
          break;
        case 'CASH':
          await payWithCash()
          break;
        case 'PAYPAL':
          /**
           * @todo - handle paypal payments
           */
          break;
        case 'MTN':
          await payWithMtn()
          break;
        default:
          return toast({
            message: "Please select a payment method before proceeding",
            type: "primary"
          })
      }
    }

  return {
    setStatus: _setStatus,
    setAuthCode: _setAuthCode,
    setStartDateTime: _setStartDateTime,
    setEndDateTime: _setEndDateTime,
    setHostId: _setHostId,
    setVehicle: _setVehicle,
    setBillingInfo: _setBillingInfo,
    bookingDetails,
    clearBookingState: _clearBookingState,
    payForReservation,
    setPaymentType: _setPaymentType,
    payForReservationError: error,
    payForReservationLoading: loading,
    paymentOption,
    booking_payment_authorization,
    clearBookingOption
  }
}

export default useBookingActions