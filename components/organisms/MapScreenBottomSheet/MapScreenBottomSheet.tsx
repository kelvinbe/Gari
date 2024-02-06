import { View } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@rneui/themed';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {  IVehicle } from '../../../types';
import BookingScreen from './BottomSheetScreens/BookingScreen';
import PaymentBottomSheet from './BottomSheetScreens/PaymentBottomSheet';
import AuthorizationBottomSheet from './BottomSheetScreens/AuthorizationCode';
import AnimatedScrollList from '../AnimatedScrollList/AnimatedScrollList';
import ModifyBookingBottomSheet from './BottomSheetScreens/ModifyBooking';
import CancelBookingBottomSheet from './BottomSheetScreens/CancelBooking';
import useBookingActions from '../../../hooks/useBookingActions';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { selectBottomSheetState,
  openAuthorizationCode as openAuthorizationCodeAction,
  openSelectPaymentMethod as openSelectPaymentMethodAction,
  startedJourney as startedJourneyAction,
  closeAuthorizationBottomSheet as closeAuthorizationBottomSheetAction,
  closePaymentBottomSheet as closePaymentBottomSheetAction,
  openBottomSheet as openBottomSheetAction,
  closeBottomSheet as closeBottomSheetAction,
  modifyBooking as modifyBookingAction,
  cancelBooking as cancelBookingAction,
  closeModifyBooking as closeModifyBookingAction,
  closeCancelBooking as closeCancelBookingAction
} from '../../../store/slices/mapBottomSheet';
import ChooseTimeBottomSheet from './BottomSheetScreens/ChooseTime';
import { Platform } from 'react-native';

interface IProps {
  onClose: () => void;
  onOpen: () => void;
  inReservation?: boolean;
  isCurrent?: boolean;
  isUpcoming?: boolean;
}

type Props = IProps;

const useStyles = makeStyles((theme, props: Props) => ({
  container: {
    paddingHorizontal: 10,
    backgroundColor: theme.colors.white,
    height: 1000,
  },
  backdropContainer: {
    backgroundColor: 'red',
    width: '100%',
    height: 1000,
  },
  mapContainer: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  vehiclesScrollContainer: {
    width: '80%',
    backgroundColor: 'transparent',
    paddingVertical: 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 10, // TODO: update 
  },
}));

const MapScreenBottomSheet = (props: Props) => {
  const state = useAppSelector(selectBottomSheetState)
  const dispatch = useAppDispatch()
  const snapPoints = ['90%'];
  const bottomSheetRef = useRef<BottomSheet>(null);
  const styles = useStyles(props);
  const {
    setVehicle,
    bookingDetails: { vehicle },
    clearBookingState
  } = useBookingActions();

  useEffect(()=>{
    if(props.inReservation){
      dispatch(openBottomSheetAction())
    }
  }, [props.inReservation])

  const openAuthorizationCode = () => {
    dispatch(openAuthorizationCodeAction())
  };

  const openSelectPaymentMethod = () => {
    dispatch(openSelectPaymentMethodAction())
  };

  const startedJourney = () => {
    dispatch(startedJourneyAction())
  };

  const closeAuthorizationBottomSheet = () => {
    dispatch(closeAuthorizationBottomSheetAction())
  };

  const closePaymentBottomSheet = () => {
    dispatch(closePaymentBottomSheetAction())
  };

  const openBottomSheet = (vehicle: IVehicle | null) => {
    setVehicle(vehicle);
    props.onOpen();
    dispatch(openBottomSheetAction())
  };

  const closeBottomSheet = () => {
    props.onClose();
    dispatch(closeBottomSheetAction())
    clearBookingState();
  };

  const openModifyBooking = () => {
    dispatch(modifyBookingAction())
  };

  const openCancelBooking = () => {
    dispatch(cancelBookingAction())
  };

  const closeModifyBooking = () => {
    dispatch(closeModifyBookingAction())
  };

  const closeCancelBooking = () => {
    dispatch(closeCancelBookingAction())
  };
  return (
    <View style={[styles.mapContainer, state.open ? { height: '100%' } : { bottom: 0 }]}>
      {(state.chooseTime) && <ChooseTimeBottomSheet/>}
      {(state.open && !state.chooseTime) && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={props?.inReservation ? false : true}
          index={0}
          style={{
            paddingBottom: 0
          }}
          onClose={closeBottomSheet}>
          <BottomSheetView style={styles.container}>
            <BookingScreen
              openAuthorization={openAuthorizationCode}
              openSelectPaymentMethod={openSelectPaymentMethod}
              isReservation={props.inReservation}
              isUpcoming={props.isUpcoming}
              isCurrent={props.isCurrent}
              startedJourney={startedJourney}
              openCancelReservation={openCancelBooking}
              openModifyReservation={openModifyBooking}
            />
          </BottomSheetView>
        </BottomSheet>
      )}
      {state.paymentOpen && <PaymentBottomSheet closeBottomSheet={closePaymentBottomSheet} />}
      {state.authorizationOpen && (
        <AuthorizationBottomSheet closeBottomSheet={closeAuthorizationBottomSheet} />
      )}
      {state.modifyBooking && <ModifyBookingBottomSheet closeBottomSheet={closeModifyBooking} />}
      {state.cancelBooking && <CancelBookingBottomSheet closeBottomSheet={closeCancelBooking} />}
      {!state.open && (
        <View style={styles.vehiclesScrollContainer}>
          {/* <DriveCardButton onPress={openBottomSheet} /> */}
          <AnimatedScrollList handleSelect={openBottomSheet} />
        </View>
      )}
    </View>
  );
};

export default MapScreenBottomSheet;
