import { View } from 'react-native';
import React, { useReducer, useState } from 'react';
import { makeStyles } from '@rneui/themed';
import PaymentBottomSheet from '../../../components/organisms/MapScreenBottomSheet/BottomSheetScreens/PaymentBottomSheet';
import AuthorizationBottomSheet from '../../../components/organisms/MapScreenBottomSheet/BottomSheetScreens/AuthorizationCode';
import ModifyBookingBottomSheet from '../../../components/organisms/MapScreenBottomSheet/BottomSheetScreens/ModifyBooking';
import CancelBookingBottomSheet from '../../../components/organisms/MapScreenBottomSheet/BottomSheetScreens/CancelBooking';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UpcomingParamList } from '../../../types';
import ReservationScreen from '../../../components/organisms/MapScreenBottomSheet/BottomSheetScreens/ReservationScreen';
import useBookingActions from '../../../hooks/useBookingActions';
import ReservationMap from '../../../components/molecules/ReservationMap/ReservationMap';
import EndReservation from '../../../components/organisms/MapScreenBottomSheet/BottomSheetScreens/EndReservation';
import ExtendReservation from '../../../components/organisms/MapScreenBottomSheet/BottomSheetScreens/ExtendReservation';
interface IProps {
  inReservation?: boolean;
  isCurrent?: boolean;
}

interface IState {
  current: boolean;
  authorizationOpen: boolean;
  paymentOpen: boolean;
  modifyBooking: boolean;
  cancelBooking: boolean;
  extendBooking: boolean;
  endBooking: boolean;
}

type Props = IProps & NativeStackScreenProps<UpcomingParamList, 'ReservationDetails'>;

const useStyles = makeStyles((theme, props: Props) => ({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1
  },
  mapContainer: {
    flex: 1
  },
}));

const initialState: IState = {
  current: false,
  authorizationOpen: false,
  paymentOpen: false,
  modifyBooking: false,
  cancelBooking: false,
  extendBooking: false,
  endBooking: false,
};

const reducer = (state: IState, action: any) => {
  switch (action.type) {
    case 'openAuthorizationCode':
      return {
        ...state,
        authorizationOpen: true,
      };
    case 'openSelectPaymentMethod':
      return {
        ...state,
        paymentOpen: true,
      };
    case 'startedJourney':
      return {
        ...state,
        upcoming: false,
        current: true,
      };
    case 'closeAuthorizationBottomSheet':
      return {
        ...state,
        authorizationOpen: false,
      };
    case 'closePaymentBottomSheet':
      return {
        ...state,
        paymentOpen: false,
      };
    case 'modifyBooking':
      return {
        ...state,
        modifyBooking: true,
      };
    case 'cancelBooking':
      return {
        ...state,
        cancelBooking: true,
      };
    case 'extendBooking':
      return {
        ...state,
        extendBooking: true,
      };
    case 'endBooking':
      return {
        ...state,
        endBooking: true,
      };
    case 'closeModifyBooking':
      return {
        ...state,
        modifyBooking: false,
      };
    case 'closeCancelBooking':
      return {
        ...state,
        cancelBooking: false,
      };
    case 'closeExtendBooking':
      return {
        ...state,
        extendBooking: false,
      };
    case 'closeEndBooking':
      return {
        ...state,
        endBooking: false,
      };

    default:
      return state;
  }
};

const ReservationDetailsScreen = (props: Props) => {
  const [state, dispatchAction] = useReducer(reducer, {
    ...initialState,
  });
  const styles = useStyles(props);
  const [open, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const {
    setVehicle,
    bookingDetails: { vehicle },
  } = useBookingActions();

  const openAuthorizationCode = () => {
    dispatchAction({ type: 'openAuthorizationCode' });
  };

  const openSelectPaymentMethod = () => {
    dispatchAction({ type: 'openSelectPaymentMethod' });
  };

  const startedJourney = () => {
    dispatchAction({ type: 'startedJourney' });
  };

  const closeAuthorizationBottomSheet = () => {
    dispatchAction({ type: 'closeAuthorizationBottomSheet' });
  };

  const closePaymentBottomSheet = () => {
    dispatchAction({ type: 'closePaymentBottomSheet' });
  };

  const openModifyBooking = () => {
    dispatchAction({ type: 'modifyBooking' });
  };
  const openCancelBooking = () => {
    dispatchAction({ type: 'cancelBooking' });
  };
  const openExtendBooking = () => {
    dispatchAction({ type: 'extendBooking' });
  };
  const openEndBooking = () => {
    dispatchAction({ type: 'endBooking' });
  };

  const closeModifyBooking = () => {
    dispatchAction({ type: 'closeModifyBooking' });
  };

  const closeCancelBooking = () => {
    dispatchAction({ type: 'closeCancelBooking' });
  };
  const closeExtendBooking = () => {
    dispatchAction({ type: 'closeExtendBooking' });
  };
  const closeEndBooking = () => {
    dispatchAction({ type: 'closeEndBooking' });
  };
  const navigateToVehicleInspection = () => {
    props.navigation.navigate('VehicleInspection');
  };
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <ReservationMap />
      </View>
      <ReservationScreen
        isReservation={props.inReservation}
        isCurrent={props.route.params?.current}
        openAuthorization={openAuthorizationCode}
        openSelectPaymentMethod={openSelectPaymentMethod}
        startedJourney={startedJourney}
        openModifyReservation={openModifyBooking}
        openCancelReservation={openCancelBooking}
        openExtendReservation={openExtendBooking}
        openEndReservation={openEndBooking}
        navigateToVehicleInspection={navigateToVehicleInspection}
      />
      {state.paymentOpen && <PaymentBottomSheet closeBottomSheet={closePaymentBottomSheet} />}
      {state.authorizationOpen && (
        <AuthorizationBottomSheet closeBottomSheet={closeAuthorizationBottomSheet} />
      )}
      {state.modifyBooking && <ModifyBookingBottomSheet closeBottomSheet={closeModifyBooking} />}
      {state.cancelBooking && <CancelBookingBottomSheet closeBottomSheet={closeCancelBooking} />}
      {state.extendBooking && <ExtendReservation closeBottomSheet={closeExtendBooking} />}
      {state.endBooking && <EndReservation closeBottomSheet={closeEndBooking} />}
    </View>
  );
};

export default ReservationDetailsScreen;
