import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabParamList, UpcomingParamList } from '../../../types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import ReservationDetailsScreen from './ReservationDetailsScreen';
import UpcomingHomeScreen from './UpcomingHomeScreen';
import BaseTopBar from '../../../navigation/TopBar/BaseTopBar';
import VehicleInspection from './VehicleInspection';
import LoadingReservation from './LoadingReservation';
import ErrorScreen from './ErrorScreen';

type Props = BottomTabScreenProps<BottomTabParamList, 'Upcoming'>;

const UpcomingReservationsStack = createNativeStackNavigator<UpcomingParamList>();

const UpcomingScreen = () => {
  
  return (
      <UpcomingReservationsStack.Navigator initialRouteName="UpcomingReservationsHome">
        <UpcomingReservationsStack.Screen
          name="UpcomingReservationsHome"
          options={{
            header: props => <BaseTopBar home {...props} title="Upcoming Reservations" />,
            animation: "slide_from_right"
          }}
          component={UpcomingHomeScreen}
        />
        <UpcomingReservationsStack.Screen
          name="ReservationDetails"
          options={{
            header: props => <BaseTopBar home={false} chevronLeft {...props} title="Your Reservation" />,
            animation: "slide_from_right"
          }}
          component={ReservationDetailsScreen}
        />
        <UpcomingReservationsStack.Screen
          name="VehicleInspection"
          options={{
            header: props => (
              <BaseTopBar home={false} chevronLeft {...props} title="Vehicle Inspection" />
            ),
            animation: "slide_from_right"
          }}
          component={VehicleInspection}
        />
        <UpcomingReservationsStack.Screen 
          name="LoadingScreen"
          options={{
            headerShown: false,
            animation: "slide_from_right"
          }}
          component={LoadingReservation}
        />
        <UpcomingReservationsStack.Screen 
          name="ErrorScreen"
          options={{
            headerShown: false,
            animation: "slide_from_left"
          }}
          component={ErrorScreen}
        />
      </UpcomingReservationsStack.Navigator>
  );
};

export default UpcomingScreen;

const styles = StyleSheet.create({});
