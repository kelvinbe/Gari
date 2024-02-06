import React, { useEffect } from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabParamList, RootStackParamList, SearchScreenParamList } from '../../../types';
import { ThemeConsumer } from '@rneui/themed';
import { View } from 'react-native';
import SearchScreenHome from './SearchScreen';
import BookingConfirmationScreen from './BookingConfirmationScreen';
import BaseTopBar from '../../../navigation/TopBar/BaseTopBar';
import MapScreen from './MapScreen';
import AddCard from '../ProfileScreen/PaymentDetailsScreen/AddCard';
import { isNull } from 'lodash';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/firebaseApp';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { fetchOnboarding } from '../../../store/slices/onBoardingSlice';
import { fetchUserData } from '../../../store/slices/userSlice';
import { selectChosenHostCode } from '../../../store/slices/bookingSlice';
import useBookingActions from '../../../hooks/useBookingActions';
import { selectCurrentScreen, selectPreviousScreen } from '../../../store/slices/navigationSlice';
const SearchScreenStacks = createNativeStackNavigator<SearchScreenParamList>();



const SearchScreen = (props: NativeStackScreenProps<BottomTabParamList, 'SearchScreen'>) => {
  const [user] = useAuthState(auth);
  const dispatch = useAppDispatch();
  const host_code = useAppSelector(selectChosenHostCode)
  const { clearBookingState } = useBookingActions()
  const  currentScreen = useAppSelector(selectCurrentScreen)
  const  prevScreen = useAppSelector(selectPreviousScreen)

  useEffect(()=>{
    if (currentScreen === 'SearchScreenHome' && prevScreen === 'MapScreen') {
      clearBookingState()
    }
  }, [currentScreen, prevScreen])
  
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <View
          style={{
            flex: 1
          }}>
          <SearchScreenStacks.Navigator
            initialRouteName="SearchScreenHome"
            key={currentScreen}
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
            }}>
            <SearchScreenStacks.Screen
              options={{
                headerShown: false,
                animation: 'slide_from_right'
              }}
              name="SearchScreenHome"
              component={SearchScreenHome}
            />
            <SearchScreenStacks.Screen
              name="BookingConfirmationScreen"
              options={{
                header: props => (
                  <BaseTopBar
                    onHomePress={() => props.navigation.navigate('SearchScreenHome')}
                    onBackPress={() => props.navigation.navigate('SearchScreenHome')}
                    home={false}
                    title={'Confirmation'}
                    {...props}
                  />
                ),
                animation: 'slide_from_bottom'
              }}
              component={BookingConfirmationScreen}
            />
            <SearchScreenStacks.Screen
              name="MapScreen"
              options={{
                header: props => (
                  <BaseTopBar
                    onHomePress={() => props.navigation.navigate('SearchScreenHome')}
                    onBackPress={() => props.navigation.navigate('SearchScreenHome')}
                    home
                    chevronLeft
                    title={
                      (props.route.params as any)?.searchType === 'local'
                        ? 'Search Locally'
                        : host_code ?  `${host_code}'s Vehicles` : "Booking Screen"
                    }
                    {...props}
                  />
                ),
                animation: 'slide_from_bottom'
              }}
              component={MapScreen}
            />
          </SearchScreenStacks.Navigator>
        </View>
      )}
    </ThemeConsumer>
  );
};

export default SearchScreen;
