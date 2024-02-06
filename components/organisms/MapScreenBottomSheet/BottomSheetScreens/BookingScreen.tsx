import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { makeStyles } from '@rneui/themed';
import Rounded from '../../../atoms/Buttons/Rounded/Rounded';
import { useAddReservationMutation } from '../../../../store/slices/reservationSlice';
import RoundedOutline from '../../../atoms/Buttons/Rounded/RoundedOutline';
import useBookingActions from '../../../../hooks/useBookingActions';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import useToast from '../../../../hooks/useToast';
import Loading from '../../../molecules/Feedback/Loading/Loading';
import { useAppDispatch } from '../../../../store/store';
import { isEmpty, isNull } from 'lodash';
import BookingCarComponent from './BookingCarComponent';
import { IReservation, SearchScreenParamList } from '../../../../types';
import { useConfirmPaymentQuery } from '../../../../store/slices/billingSlice';
import * as Linking from 'expo-linking'
import dayjs from 'dayjs';

interface IProps {
  openAuthorization?: () => void;
  openSelectPaymentMethod?: () => void;
  isReservation?: boolean;
  isUpcoming?: boolean;
  isCurrent?: boolean;
  openCancelReservation?: () => void;
  openModifyReservation?: () => void;
  startedJourney?: () => void;
}

type Props = IProps;

const useStyles = makeStyles((theme, props) => {
  return {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.white,
    },
    divider: {
      marginVertical: 20,
      backgroundColor: theme.colors.stroke,
    },
    bottomSection: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
});

const BookingScreen = (props: Props) => {
  const styles = useStyles(props);
  const {
    bookingDetails: {
      end_date_time,
      start_date_time,
      vehicle,
      code,
      paymentType,
      status,
      reservation_payment_method
    },
    clearBookingState,
    payForReservation,
    payForReservationLoading,
    paymentOption,
    booking_payment_authorization,
    clearBookingOption
  } = useBookingActions();
  const [addReservation, { isLoading }] = useAddReservationMutation();
  const { navigate } = useNavigation<NavigationProp<SearchScreenParamList>>();
  const reduxDispatch = useAppDispatch();
  

  const { data: confirmationData, isError, isLoading: confirmationLoading } = useConfirmPaymentQuery({
    authorization: booking_payment_authorization ?? "" // the empty string will not happen, because of the skip condition 
  }, {
    pollingInterval: 30000, // 1/2 a minute polling
    skip: isEmpty(paymentOption) || isNull(booking_payment_authorization)
  })
  const toast = useToast();

  useEffect(() => {
    if (!isEmpty(paymentOption)) {
      if (confirmationData) {
        switch(confirmationData){
          case "SUCCEEDED": {
            clearBookingOption()
            toast({
              message: 'Payment Successful',
              type: 'success',
            })
            addReservation({
                body: {
                station_id: vehicle?.station_id,
                vehicle_id: vehicle?.id,
                start_date_time: dayjs(start_date_time).format(),
                end_date_time:dayjs(end_date_time).format(),
              },
              headers:booking_payment_authorization ?? ""
            }).unwrap().then((reservation)=>{
            const res = reservation as Partial<IReservation>
              reduxDispatch(clearBookingState());
              navigate('BookingConfirmationScreen', {
                reservationId: res?.id ?? ""
              })
            }).catch((e)=>{
              toast({
                message: 'Please contact support',
                type: 'error',
                duration: 3000,
                title: 'An Error Occured',
              })
            })
            break
          }
          case "FAILED": {
            clearBookingOption()
            toast({
              message: "Payment Failed",
              type: 'error',
            })
            break;
          }
          case "CANCELLED": {
            clearBookingOption()
            toast({
              message: "Payment Cancelled",
              type: 'error',
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
      }else{
        if (isError) {
          toast({
            message: 'Please contact support',
            type: 'error',
            duration: 3000,
            title: 'An Error Occured',
          })
        } else {
          toast({
            message: "Re-trying to confirm payment",
            type: 'primary',
          })
        }
      }
    }
  }, [confirmationData]);

  const onBack = () => {
    Linking.openURL(Linking.createURL('/manage-reservations'))
  }

  const makeBooking = () => {
    return payForReservation()
  };

  return isLoading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <BookingCarComponent
        hasAuthorizationCode={props?.isReservation}
        hasLinkedCard={props?.isReservation}
        openAuthorizationCode={props?.openAuthorization}
        openSelectPaymentMethod={props?.openSelectPaymentMethod}
      />
      {props?.isReservation ?  (
        status === "COMPLETE" ? (<View style={[
          styles.bottomSection,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
        ]} >
          <Rounded  onPress={onBack} >
            Back
          </Rounded>
        </View>) : (
          <View
            style={[
              styles.bottomSection,
              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
            ]}>
            <RoundedOutline onPress={props?.openCancelReservation} width={reservation_payment_method !== "CASH" ? "45%" : "90%"}>
              {
                status === "ACTIVE" ? "End" : "Cancel"
              }
            </RoundedOutline>
            {(reservation_payment_method !== "CASH") &&<Rounded
             onPress={props?.openModifyReservation} 
             width="45%">
              Modify
            </Rounded>}
          </View>
        )
      ) : (
        <View style={styles.bottomSection}>
          <Rounded
            fullWidth
            loading={ isEmpty(paymentOption) ? payForReservationLoading : confirmationLoading}
            onPress={makeBooking}
            disabled={isEmpty(paymentType) || isEmpty(code) || !isEmpty(paymentOption)}>
              {
                isEmpty(paymentOption) ? "Book Now" : "Confirming Payment..."
              }
          </Rounded>
        </View>
      )}
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({});
