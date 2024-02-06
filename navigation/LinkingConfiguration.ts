import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          SearchScreen: {
            screens: {
              SearchScreenHome: 'search',
              BookingConfirmationScreen: 'booking-confirmation',
              MapScreen: 'map',
            },
          },
          History: 'history',
          Upcoming: {
            screens: {
              UpcomingReservationsHome: 'upcoming',
              ReservationDetails: 'upcoming-reservation-details',
              VehicleInspection: 'upcoming-vehicle-inspection',
            },
          },
          Profile: {
            screens: {
              ProfileScreenHome: 'profile',
              ProfileScreenEdit: 'edit',
              PaymentDetailsScreen: {
                screens: {
                  PaymentDetailsScreenHome: 'payment-details',
                  MPesaDetailsScreen: 'mpesa-details',
                  AddCardScreen: 'add-card',
                },
              },
              ProfileSettingsScreen: 'settings',
              DriverLicenseScreen: 'driver-license',
              AboutScreen: 'about',
              PrivacyPolicy: 'privacy-policy',
              UserAgreement: 'user-agreement',
              SupportScreen: 'profile-support',
            },
          },
          ManageRes: {
            screens: {
              ManageResHome: 'manage-reservations',
              BookingDetails: 'res-booking-details',
            },
          },
          Issues: 'issues',
          BookingDetails: 'booking-details',
          ReservationDetails: 'reservation-details',
          VehicleInspection: 'vehicle-inspection',
        },
      },
      Login: 'login',
      Register: 'register',
      ForgotPassword: 'forgot-password',
      ConfirmationSent: 'confirmation-sent',
      Verification: 'verification',
      ChangePassword: 'change-password',
      SupportScreen: 'support',
      Onboarding: {
        screens: {
          OnboardingHome: 'onboarding',
          DriversLicense: 'drivers-license',
          Location: 'location',
          SelectPaymentMethod: 'select-payment-method',
          SelectedPaymentMethod: 'selected-payment-method',
        },
      },
    },
  },
};

export default linking;
