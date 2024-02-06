import { Text, View } from 'react-native';
import React, { useRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { makeStyles, ThemeConsumer } from '@rneui/themed';
import Rounded from '../../../atoms/Buttons/Rounded/Rounded';
import RoundedOutline from '../../../atoms/Buttons/Rounded/RoundedOutline';
import useEndReservation from '../../../../hooks/useEndReservation';
import { IReservation } from '../../../../types';
import useToast from '../../../../hooks/useToast';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { modifyCurrentReservation, selectModifyReservationFeedback } from '../../../../store/slices/bookingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useBackgroundLocationTask from '../../../../hooks/useBackgroundLocationTask';
interface IProps {
  closeBottomSheet?: () => void;
}

type Props = IProps;

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
    },
    contentTitleStyle: {
      fontWeight: '700',
      fontFamily: 'Lato_700Bold',
      fontSize: 20,
      marginBottom: 20,
    },
    descriptionContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    textStyle: {
      fontSize: 20,
      fontWeight: '400',
      fontFamily: 'Lato_400Regular',
      color: theme.colors.black,
    },
    bottomButtonsContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
  };
});

const EndReservation = (props: Props) => {
  const { stopUpdates } = useBackgroundLocationTask()
  const toast = useToast()

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['30%'];
  const styles = useStyles(props);

  const dispatch = useAppDispatch()
  const feedback = useAppSelector(selectModifyReservationFeedback)
  const close = () => {
    bottomSheetRef.current?.close();
    props.closeBottomSheet && props.closeBottomSheet();
  };

  const handleStop = () => {
    dispatch(modifyCurrentReservation({
      status: "COMPLETE"
    })).then(async ()=>{
      // This will stop the background tracking service 
      await stopUpdates()
      toast({
        message: "Reservation ended successfully",
        type: "success",
        duration: 3000
      })
    }).catch((e)=>{ 
      toast({
        message: "Error ending reservation",
        type: "error",
        duration: 3000
      })
    })
    close();
  };

  const handleCancel = async () => {
    
    close();
  };

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
            <Text style={styles.contentTitleStyle}>Are you sure?</Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.textStyle}>You will end your ride</Text>
            </View>
            <View style={styles.bottomButtonsContainer}>
              <RoundedOutline loading={feedback.loading} onPress={handleStop} width="40%">
                Yes
              </RoundedOutline>
              <Rounded onPress={handleCancel} width="40%">
                No
              </Rounded>
            </View>
          </View>
        </BottomSheet>
      )}
    </ThemeConsumer>
  );
};

export default EndReservation;
