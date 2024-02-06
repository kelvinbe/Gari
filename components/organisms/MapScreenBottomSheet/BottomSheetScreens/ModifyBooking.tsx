import { StyleSheet, Text, View } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { makeStyles, ThemeConsumer } from '@rneui/themed';
import CashIcon from '../../../../assets/icons/cash.svg';
import ActionButton from '../../../atoms/Buttons/ActionButton/ActionButton';
import VisaIcon from '../../../../assets/icons/visa.svg';
import { Image } from '@rneui/base';
import BaseInput from '../../../atoms/Input/BaseInput/BaseInput';
import Rounded from '../../../atoms/Buttons/Rounded/Rounded';
import TimeFilter from '../../../molecules/TimeFilter/TimeFilter';
import RoundedOutline from '../../../atoms/Buttons/Rounded/RoundedOutline';
import useBookingActions from '../../../../hooks/useBookingActions';
import useToast from '../../../../hooks/useToast';
import { clearBookingState, modifyCurrentReservation, selectModifyReservationFeedback } from '../../../../store/slices/bookingSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import dayjs from 'dayjs';
import { isEmpty, isNull } from 'lodash';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useConfirmPaymentQuery } from '../../../../store/slices/billingSlice';
import { IReservation } from '../../../../types';
import { calcDuration } from '../../../../utils/utils';



interface IProps {
  closeBottomSheet?: () => void;
}

type Props = IProps

const useStyles = makeStyles((theme, props: Props) => {
  return {
    container: {},
    backdropContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    backgroundStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.white,
    },
    contentContainer: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    contentTitleStyle: {
      width: '100%',
      fontWeight: '700',
      fontFamily: 'Lato_700Bold',
      fontSize: 20,
      textAlign: 'center',
    },
    inputContainer: {
      width: '100%',
      marginTop: 20,
    },
    bottomButtonsContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: 20,
      marginTop: 150,
    },
    currency: {
      fontWeight: '500',
      fontFamily: 'Lato_400Regular',
      fontSize: 14,
      color: theme.colors.black,
    }
  };
});

const ModifyBookingBottomSheet = (props: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['50%'];
  const styles = useStyles(props);

  const { setStartDateTime, setEndDateTime, bookingDetails, paymentOption, booking_payment_authorization, payForReservation, payForReservationLoading, clearBookingOption } = useBookingActions();
  const dispatch = useAppDispatch()
  const fetchState = useAppSelector(selectModifyReservationFeedback)
  const navigate = useNavigation()
  const {vehicle} = bookingDetails
  const toast = useToast()
  const reservationStartTime = {label: dayjs(bookingDetails.start_date_time).format("h:mm"), value: bookingDetails.start_date_time}
  const reservationEndTime = {label: dayjs(bookingDetails.end_date_time).format("h:mm"), value: bookingDetails.end_date_time}
  const amount = Math.ceil(((vehicle?.hourly_rate ?? 0) * calcDuration(bookingDetails.start_date_time, bookingDetails.end_date_time)))
  const time = Math.ceil(calcDuration(bookingDetails.start_date_time, bookingDetails.end_date_time))
  const close = () => {
    bottomSheetRef.current?.close();
    props.closeBottomSheet && props.closeBottomSheet();
  };

  const { data: confirmationData, isError, isLoading: confirmationLoading } = useConfirmPaymentQuery({
    authorization: booking_payment_authorization ?? "" // the empty string will not happen, because of the skip condition 
  }, {
    pollingInterval: 30000, // 1/2 a minute polling
    skip: isEmpty(paymentOption) || isNull(booking_payment_authorization)
  })
  

  const handleCancel = () => {
    close()
  };


  const handleSave = () => {
    if (bookingDetails.paymentType?.type) {
      payForReservation().then(()=>{
      }).catch((e)=>{
        toast({
          type: 'error',
          message: 'Error modifying booking',
          duration: 3000,
        })
      })
}else{
  toast({
    type: 'error',
    message: 'Something went wrong',
    duration: 3000
  })
}
}

useEffect(() => {
    if (!isEmpty(paymentOption)) {
      if(confirmationData){
        switch(confirmationData){
          case 'SUCCEEDED': {
            clearBookingOption()
            dispatch(modifyCurrentReservation({
              vehicle_id: vehicle?.id,
              start_date_time: dayjs(bookingDetails.start_date_time).format(),
              end_date_time:  dayjs(bookingDetails.end_date_time).format()
            })).then(() => {
              toast({
                type: 'success',
                message: 'Booking modification confirmed successfully',
                duration: 3000,
              })
              close()
            }).catch(() => {
                toast({
                  type: 'error',
                  message: 'Please Contact Support',
                  duration: 3000,
                })
            })
            break;
          }
          case 'FAILED':{
            clearBookingOption()
            toast({
              type: 'error',
              message: 'Booking modification failed, try again',
            })
            break;
          }
          case 'CANCELLED': {
            clearBookingOption()
            toast({
              type: 'error',
              message: 'Booking modification cancelled',
            })
            break;
          }
          default: {
            toast({
              message: "Re-trying to confirm payment",
              type: 'primary'
            })
          }
        }
      }
    }else{
      if (isError) {
        toast({
          message: 'Please contact support',
          type: 'error',
          duration: 3000,
          title: 'An Error Occured',
        })
      }
    }
  }, [confirmationData])

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          containerStyle={styles.backdropContainer}
          backgroundStyle={styles.backgroundStyle}
          enablePanDownToClose
          onClose={props.closeBottomSheet}>
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitleStyle}>Modify Booking</Text>
            <View>
              <Text>Time: {`${time} hrs`}</Text>
              <Text>Amount: {amount} <Text style={styles.currency}>{vehicle?.host?.market?.currency}</Text></Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.bottomButtonsContainer}>
                <RoundedOutline
                  customStyle={{
                    elevation: 0,
                  }}
                  onPress={handleCancel}
                  width="45%">
                  Cancel
                </RoundedOutline>
                <Rounded  
                disabled={
                  !isEmpty(paymentOption)
                }
                loading={ isEmpty(paymentOption) ? payForReservationLoading : confirmationLoading}
                onPress={handleSave} width="45%">
                  {
                    isEmpty(paymentOption) ? "Save" : "Verifying"
                  }
                </Rounded>
              </View>
              <TimeFilter
                displayDay={true}
                displayPickup={true}
                displayExtendText={false}
                customStyles={{
                  paddingVertical: 0,
                  elevation: 5,
                }}
                setEndDateTime={setEndDateTime}
                setStartDateTime={setStartDateTime}
                defaultStartDateTime={reservationStartTime}
                defaultEndDateTime={reservationEndTime}
              />
            </View>
          </View>
        </BottomSheet>
      )}
    </ThemeConsumer>
  );
};

export default ModifyBookingBottomSheet;


