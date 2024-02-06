import { StyleSheet, View } from 'react-native';
import React from 'react';
import { makeStyles, ThemeConsumer } from '@rneui/themed';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabParamList, ProfileScreenParamList } from '../../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreenHome from './ProfileScreenHome';
import ProfileScreenEdit from './ProfileScreenEdit';
import TopBar from './TopBar/TopBar';
import PaymentDetailsScreen from './PaymentDetailsScreen';
import ProfileSettingsScreen from './ProfileSettingsScreen';
import BaseTopBar from '../../../navigation/TopBar/BaseTopBar';
import AboutScreen from './AboutScreen';
import PrivacyPolicy from './PrivacyPolicy';
import UserAgreement from './UserAgreement';
import SupportScreen from '../../shared/SupportScreen';
import DriverLicenseScreen  from './DriverLicenseScreen';
import UserLocation from './UserLocation';

const ProfileScreenStackNavigator = createNativeStackNavigator<ProfileScreenParamList>();

interface IProps {}

type Props = IProps & BottomTabScreenProps<BottomTabParamList, 'Profile'>;

const useStyles = makeStyles((theme, props: Props) => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
}));

const ProfileScreen = (props: Props) => {
  const styles = useStyles(props);
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: theme.colors.white,
          }}>
          <ProfileScreenStackNavigator.Navigator initialRouteName="ProfileScreenHome">
            <ProfileScreenStackNavigator.Screen
              options={{
                headerShown: false,
                animation: 'slide_from_right'
              }}
              name="ProfileScreenHome"
              component={ProfileScreenHome}
            />
            <ProfileScreenStackNavigator.Screen
              options={{
                headerShown: true,
                header: props => (
                  <BaseTopBar {...props} title="Profile Settings" home={false} chevronLeft />
                ),
                animation: 'slide_from_right'
              }}
              name="ProfileScreenEdit"
              component={ProfileScreenEdit}
            />
            <ProfileScreenStackNavigator.Screen
              options={{
                headerShown: false,
              }}
              name="PaymentDetailsScreen"
              component={PaymentDetailsScreen}
            />
            <ProfileScreenStackNavigator.Screen
              options={{
                headerShown: true,
                header: props => (
                  <BaseTopBar {...props} title="Profile Settings" home={false} chevronLeft />
                ),
                animation: 'slide_from_right'
              }}
              name="ProfileSettingsScreen"
              component={ProfileSettingsScreen}
            />

            <ProfileScreenStackNavigator.Screen
              options={{
                headerShown: true,
                header: props => (
                  <BaseTopBar {...props} title="Driver License" home={false} chevronLeft />
                ),
                animation: 'slide_from_right'
              }}
              name="DriverLicenseScreen"
              component={DriverLicenseScreen}
            />
            <ProfileScreenStackNavigator.Screen
              options={{
                headerShown: true,
                header: props => <BaseTopBar {...props} title="About" home={false} chevronLeft />,
                animation: 'slide_from_right'
              }}
              name="AboutScreen"
              component={AboutScreen}
            />
            <ProfileScreenStackNavigator.Screen
              options={{
                headerShown: true,
                header: props => (
                  <BaseTopBar {...props} title="Privacy Policy" home={false} chevronLeft />
                ),
                animation: 'slide_from_right'
              }}
              name="PrivacyPolicy"
              component={PrivacyPolicy}
            />
            <ProfileScreenStackNavigator.Screen
              options={{
                headerShown: true,
                header: props => (
                  <BaseTopBar {...props} title="User Agreement" home={false} chevronLeft />
                ),
                animation: 'slide_from_right'
              }}
              name="UserAgreement"
              component={UserAgreement}
            />
            <ProfileScreenStackNavigator.Screen
              options={{
                headerShown: true,
                header: props => <BaseTopBar {...props} title="Support" home={false} chevronLeft />,
                animation: 'slide_from_right'
              }}
              name="SupportScreen"
              component={SupportScreen}
            />
            <ProfileScreenStackNavigator.Screen
              options={{
                headerShown: true,
                header: props => <BaseTopBar {...props} title="Location" home={false} chevronLeft />,
                animation: 'slide_from_right'
              }}
              name="UserLocation"
              component={UserLocation}
            />
          </ProfileScreenStackNavigator.Navigator>
        </View>
      )}
    </ThemeConsumer>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
