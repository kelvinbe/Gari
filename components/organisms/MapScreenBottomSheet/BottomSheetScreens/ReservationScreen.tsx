import { StyleSheet, Text, View } from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import { makeStyles } from '@rneui/themed';
import Rounded from '../../../atoms/Buttons/Rounded/Rounded';
import RoundedOutline from '../../../atoms/Buttons/Rounded/RoundedOutline';
import BookingCarComponent from './BookingCarComponent';
import useBookingActions from '../../../../hooks/useBookingActions';
import useToast from '../../../../hooks/useToast';
import bookingSlice, { modifyCurrentReservation } from '../../../../store/slices/bookingSlice';
import { useAppDispatch } from '../../../../store/store';
import useBackgroundLocationTask from '../../../../hooks/useBackgroundLocationTask';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { UpcomingParamList } from '../../../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking'

interface IProps {
  openAuthorization?: () => void;
  openSelectPaymentMethod?: () => void;
  isReservation?: boolean;
  isCurrent?: boolean;
  openCancelReservation?: () => void;
  openModifyReservation?: () => void;
  openExtendReservation?: () => void;
  openEndReservation?: () => void;
  startedJourney?: () => void;
  navigateToVehicleInspection?: () => void;
}

type Props = IProps;

const useStyles = makeStyles((theme, props) => {
  return {
    container: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      paddingVertical: 10,
      backgroundColor: theme.colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    divider: {
      marginVertical: 20,
      backgroundColor: theme.colors.stroke,
    },
    bottomSection: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bottomSheetView: {
      alignItems: 'center',
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderLeftWidth: 1,
      borderTopColor: theme.colors.grey0,
      borderLeftColor: theme.colors.grey0,
      borderRightColor: theme.colors.grey0,
      paddingHorizontal: 20,
      paddingVertical: 20,
      width: "100%"
    },
    bottomSheetButtonContainer: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingVertical: 5,
    }
  };
});

const ReservationScreen = (props: Props) => {
  const styles = useStyles(props);
  const {bookingDetails} = useBookingActions()
  const [show_bottom_sheet, setShowBottomSheet] = useState(false)
  const bottom_sheet_ref = React.useRef<BottomSheet>(null)
  const snap_points = React.useMemo(() => ['30%'], [])
  const navProps = useNavigation<NavigationProp<UpcomingParamList>>()
  const toast = useToast()


  const { requestLocationPermissions, trackingState, stopUpdates } = useBackgroundLocationTask()

  const openBottomSheet = () => {
    setShowBottomSheet(true)
  }

  const closeBottomSheet = () => {
    bottom_sheet_ref.current?.close()
    setShowBottomSheet(false)
  }

  const handleLocationPermissions = async () => {
    const hasPermissions = await requestLocationPermissions()
    if(hasPermissions){
      navProps.navigate("LoadingScreen", {
        reservation_id: bookingDetails.reservation_id
      })
      closeBottomSheet()
    }else{
      toast({
        type:'error',
        message: "Enable location permissions to proceed"
      })
    }
  }

  const startReservation = () => {
    if(trackingState?.backgroundLocationStatus === 'granted'){
      navProps.navigate("LoadingScreen", {
        reservation_id: bookingDetails.reservation_id
      })
      closeBottomSheet()
    }else{
      openBottomSheet()
    }
  }

  const renderBackdrop = useCallback((props: any) => {
    return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
  }, [])

  useEffect(()=>{
    if(props?.isCurrent){
      Linking.openURL(Linking.createURL('upcoming')).then(()=>{
        Linking.openURL(Linking.createURL("/manage-reservations"))
      })
    }
  }, [props.isCurrent])

  return (
    <View style={styles.container}>
      <BookingCarComponent
        hasAuthorizationCode={props?.isReservation}
        hasLinkedCard={props?.isReservation}
        openAuthorizationCode={props?.openAuthorization}
        openSelectPaymentMethod={props?.openSelectPaymentMethod}
      />
      {props?.isCurrent ? (
        <View
          style={[
            styles.bottomSection,
            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
          ]}>
          <RoundedOutline onPress={props?.openExtendReservation} width="40%">
            Extend
          </RoundedOutline>
          <Rounded onPress={props?.openEndReservation} width="40%">
            End
          </Rounded>
        </View>
      ) : (
        <View
          style={[
            styles.bottomSection,
            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
          ]}>
          <RoundedOutline onPress={startReservation} width={bookingDetails?.reservation_payment_method === "CASH" ? "80%" :"40%"}>
            Start
          </RoundedOutline>
          {(bookingDetails?.reservation_payment_method !== "CASH") && <Rounded onPress={props?.openModifyReservation} width="40%">
            Modify
          </Rounded>}
        </View>
      )}
      {
        show_bottom_sheet && <BottomSheet
          ref={bottom_sheet_ref}
          snapPoints={snap_points}
          style={styles.bottomSheetView}
          backdropComponent={renderBackdrop}
        >
          
          <Text>
            To proceed with the ride, you must have background location services enabled.
          </Text>
          <View style={styles.bottomSheetButtonContainer} >
            <Rounded onPress={handleLocationPermissions}  width="40%">
              Enable
            </Rounded>
            <RoundedOutline width="40%"  onPress={closeBottomSheet} >
              Cancel
            </RoundedOutline>
          </View>
        </BottomSheet>
      }
    </View>
  );
};

export default ReservationScreen;

