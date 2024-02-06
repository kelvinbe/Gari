import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { makeStyles } from '@rneui/themed';
import useBookingActions from '../../../hooks/useBookingActions';
import dayjs from 'dayjs';
import { isNull } from 'lodash';
import { calcDuration } from '../../../utils/utils';

interface IProps {}

type Props = IProps;

const useStyles = makeStyles((theme, props: Props) => {
  return {
    container: {
      width: '100%',
      paddingHorizontal: 18,
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: 5,
    },
    sectionTitle: {
      fontWeight: '500',
      fontFamily: 'Lato_400Regular',
      fontSize: 14,
      color: theme.colors.black,
    },
    sectionValue: {
      fontWeight: '500',
      fontFamily: 'Lato_400Regular',
      fontSize: 14,
      color: theme.colors.grey3,
      marginLeft: 5,
    },
  };
});

const BookingCarDetailsRate = (props: Props) => {
  const styles = useStyles(props);

  const {
    bookingDetails: { vehicle, start_date_time: startDateTime, end_date_time: endDateTime },
  } = useBookingActions();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Total Duration: </Text>
        <Text style={styles.sectionValue}>{calcDuration(startDateTime, endDateTime).toFixed(1)}hr(s)</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rate</Text>
        <Text style={styles.sectionValue}>{vehicle?.host?.market?.currency} {vehicle?.hourly_rate || 0} / hr</Text>
      </View>
    </View>
  );
};

export default BookingCarDetailsRate;

const styles = StyleSheet.create({});
