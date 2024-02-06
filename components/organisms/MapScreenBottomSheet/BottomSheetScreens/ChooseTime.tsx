import { Text, View } from 'react-native';
import React, { useRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { makeStyles } from '@rneui/themed';
import Rounded from '../../../atoms/Buttons/Rounded/Rounded';
import TimeFilter from '../../../molecules/TimeFilter/TimeFilter';
import useBookingActions from '../../../../hooks/useBookingActions';
import dayjs from 'dayjs';
import { calcDuration } from '../../../../utils/utils';
import useToast from '../../../../hooks/useToast';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { closeChooseTime, selectBottomSheetState } from '../../../../store/slices/mapBottomSheet';
import { useGetVehicleQuery } from '../../../../store/slices/vehiclesSlice';
import { isEmpty } from 'lodash';



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

const ChooseTimeBottomSheet = (props: Props) => {
  const { notification } = useAppSelector(selectBottomSheetState)
  const { data, isLoading, isError, refetch, isFetching } = useGetVehicleQuery(notification?.vehicle_id)
  const dispatch = useAppDispatch()
  const toast = useToast()
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['50%'];
  const styles = useStyles(props);

  const { setStartDateTime, setEndDateTime, bookingDetails: {start_date_time, end_date_time}, setVehicle } = useBookingActions();
  const reservationStartTime = {label: dayjs(start_date_time).format("h:mm"), value: start_date_time}
  const reservationEndTime = {label: dayjs(end_date_time).format("h:mm"), value: end_date_time}


  const handleContinue = () => {
    const duration  = calcDuration(start_date_time, end_date_time)


    if( duration <= 0) {
        toast({
            type: "error",
            message: "Please select a valid time range"
        })
        return 
    }

    refetch().unwrap().then((data)=>{
      if(isEmpty(data)){
          toast({
              type: "error",
              message: "Vehicle not found"
          })
          return 
      }
      setVehicle(data)
      bottomSheetRef.current?.close()
  
      dispatch(closeChooseTime())
        
    }).catch(()=>{
      toast({
          type: "error",
          message: "Something went wrong, try again later"
      })

    })


  }



  return (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          containerStyle={styles.backdropContainer}
          backgroundStyle={styles.backgroundStyle}
          enablePanDownToClose
          onClose={props.closeBottomSheet}>
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitleStyle}>Select a time to continue</Text>
            <View style={styles.inputContainer}>
              <View style={styles.bottomButtonsContainer}>
                <Rounded  
                 onPress={handleContinue}
                 loading={isLoading || isFetching}
                 width="100%">
                  Continue
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
  );
};

export default ChooseTimeBottomSheet;


