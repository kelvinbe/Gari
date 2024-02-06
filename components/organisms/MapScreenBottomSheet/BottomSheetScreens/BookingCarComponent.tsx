import React from 'react';
import { View } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { Divider } from '@rneui/base';
import BookingCarDetails from '../../../molecules/BookingCarDetails/BookingCarDetails';
import BookingCarDetailsDriver from '../../../molecules/BookingCarDetails/BookingCarDetailsDriver';
import BookingCarSchedule from '../../../molecules/BookingCarDetails/BookingCarSchedule';
import BookingCarDetailsRate from '../../../molecules/BookingCarDetails/BookingCarDetailsRate';
import BookingCarPaymentInfo from '../../../molecules/BookingCarDetails/BookingCarPaymentInfo';

interface IProps {
  hasAuthorizationCode?: boolean;
  openAuthorizationCode?: () => void;
  hasLinkedCard?: boolean;
  openSelectPaymentMethod?: () => void;
}
const useStyles = makeStyles((theme, props) => {
  return {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.white,
    },
    divider: {
      marginVertical: 18,
      marginHorizontal: 18,
      backgroundColor: theme.colors.stroke,
    },
    bottomSection: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
});
function BookingCarComponent(props: IProps) {
  const styles = useStyles(props);

  return (
    <View>
      <BookingCarDetails />
      <Divider style={styles.divider} />
      <BookingCarSchedule />
      <Divider style={styles.divider} />
      <BookingCarDetailsDriver
        hasAuthorizationCode={props?.hasAuthorizationCode}
        openAuthorizationCode={props.openAuthorizationCode}
      />
      <Divider style={styles.divider} />
      <BookingCarDetailsRate />
      <Divider style={styles.divider} />
      <BookingCarPaymentInfo
        hasLinkedCard={props?.hasLinkedCard}
        openSelectPaymentMethod={props.openSelectPaymentMethod}
      />
      <Divider style={styles.divider} />
    </View>
  );
}

export default BookingCarComponent;
