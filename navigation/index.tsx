import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigationContainerRef,
  useNavigation,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Platform } from "react-native";
import {
  BottomTabParamList,
  RootStackParamList,
  UserOnboardingParamList,
} from "../types";
import LoginScreen from "../screens/Stacks/LoginScreen";
import RegisterScreen from "../screens/Stacks/RegisterScreen";
import ForgotPasswordScreen from "../screens/Stacks/ForgotPasswordScreen";
import HistoryScreen from "../screens/Tabs/HistoryScreen";
import { ThemeConsumer } from "@rneui/themed";
import ProfileScreen from "../screens/Tabs/ProfileScreen";
import UserIcon from "../assets/icons/user.svg";
import ManageResScreen from "../screens/Tabs/ManageResScreen";
import ManageIcon from "../assets/icons/manage.svg";
import WarningIcon from "../assets/icons/warning.svg";
import IssuesScreen from "../screens/Tabs/IssuesScreen";
import { makeStyles, Theme } from "@rneui/base";
import _SearchScreen from "../screens/Tabs/SearchScreen/SearchScreen";
import SearchScreen from "../screens/Tabs/SearchScreen";
import {
  hideBottomNav,
  selectDisplayBottomNav,
  selectNavState,
  setNavScreens,
  showBottomNav,
} from "../store/slices/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setBackgroundColorAsync,
  setVisibilityAsync,
} from "expo-navigation-bar";
import ClockIcon from "../assets/icons/clock.svg";
import BaseTopBar from "./TopBar/BaseTopBar";
import ConfirmationSentScreen from "../screens/Stacks/ConfirmationSentScreen";
import VerificationScreen from "../screens/Stacks/VerificationScreen";
import { useAuthState } from "react-firebase-hooks/auth";
import ChangePasswordScreen from "../screens/Stacks/ChangePasswordScreen";
import CustomSafeAreaView from "../components/common/CustomSafeAreaView/CustomSafeAreaView";
import SupportScreen from "../screens/shared/SupportScreen";
import { auth } from "../firebase/firebaseApp";
import BookingDetailsScreen from "../screens/shared/BookingDetailsScreen";
import ReservationDetailsScreen from "../screens/Tabs/UpcomingScreen/ReservationDetailsScreen";
import UpcomingHomeScreen from "../screens/Tabs/UpcomingScreen/UpcomingHomeScreen";
import UpcomingScreen from "../screens/Tabs/UpcomingScreen";
import VehicleInspection from "../screens/Tabs/UpcomingScreen/VehicleInspection";
import Onboarding from "../screens/Stacks/Onboarding";
import DriversLicense from "../screens/Stacks/Onboarding/DriversLicense";
import Location from "../screens/Stacks/Onboarding/Location";
import SelectPaymentMethod from "../screens/Stacks/Onboarding/SelectPaymentMethod";
import SelectedPaymentMethod from "../screens/Stacks/Onboarding/SelectedPaymentMethod";
import { onAuthStateChanged } from "firebase/auth";
import { isNull } from "lodash";
import { fetchUserData } from "../store/slices/userSlice";
import { useAppDispatch } from "../store/store";
import linking from "./LinkingConfiguration";
import { fetchOnboarding } from "../store/slices/onBoardingSlice";

const ScreensWithNoBottomNav = [
  "BookingConfirmationScreen",
  "ProfileScreenEdit",
  "PaymentDetailsScreenHome",
  "MPesaDetailsScreen",
  "ProfileSettingsScreen",
  "MapScreen",
  "BookingDetails",
  "ReservationDetails",
  "AddCardScreen",
  "AboutScreen",
  "SupportScreen",
  "PrivacyPolicy",
  "UserAgreement",
  "VehicleInspection",
  "OnboardingHome",
  "DriverLicenseScreen",
  "MobileMoneyDetailsScreen",
];

const ScreensWithNoTopBar = ["SearchScreenHome"];

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef<any>();
  const dispatch = useDispatch();
  const onReadyHandler = () => {
    routeNameRef.current = navigationRef.getCurrentRoute()?.name;
  };
  const onStateChangeHandler = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.getCurrentRoute()?.name;
    if (previousRouteName !== currentRouteName) {
      routeNameRef.current = currentRouteName;
      dispatch(
        setNavScreens({
          current: currentRouteName,
          previous: previousRouteName,
        })
      );
    }
  };
  return (
    <NavigationContainer
      onReady={onReadyHandler}
      ref={navigationRef}
      onStateChange={onStateChangeHandler}
      linking={linking}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const UserOnboardingNavigator = createNativeStackNavigator<
  UserOnboardingParamList
>();
type onBoardingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Onboarding"
>;
export function UserOnboardingNavigation(props: onBoardingScreenProps) {
  /**
   * @description, to prevent a new reference of these functions being created on every render, we use React.useCallback
   *                it also ensures the components that receive these functions as props don't re-render unnecessarily
   */

  const dispatch = useAppDispatch();

  const goToApp = React.useCallback(() => {
    props.navigation.navigate("Root");
  }, []);

  const goToLogin = React.useCallback(() => {
    props.navigation.navigate("Login");
  }, []);

  onAuthStateChanged(auth, (user) => {
    if (isNull(user)) {
      goToLogin();
    } else {
      const meta = user?.metadata;
      if (meta?.creationTime === meta?.lastSignInTime) {
        // !!! IMPORTANT !!!   this is a new user, so we need to wait for their details to be created on the backend before we can proceed
        setTimeout(() => {
          dispatch(fetchUserData(null));
        }, 2000);
      } else {
        dispatch(fetchUserData(null));
      }
    }
  });
  return (
    <UserOnboardingNavigator.Navigator initialRouteName="OnboardingHome">
      <UserOnboardingNavigator.Screen
        name="OnboardingHome"
        options={{ headerShown: false, animation: "slide_from_right" }}
        children={(props) => (
          <Onboarding goToApp={goToApp} goToLogin={goToLogin} {...props} />
        )}
      />
    </UserOnboardingNavigator.Navigator>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [showTopNav, setShowTopNav] = React.useState(false);
  const [currentScreen, previousScreen] = useSelector(selectNavState);

  React.useEffect(() => {
    if (ScreensWithNoTopBar?.includes(currentScreen)) {
      setShowTopNav(false);
    }
    if (!ScreensWithNoTopBar?.includes(currentScreen)) {
      setShowTopNav(true);
    }
  }, [currentScreen, previousScreen]);

  React.useEffect(() => {
    if (Platform.OS === "android") {
      setBackgroundColorAsync("white");
    } else {
      // I'm yet to find an ios alternative for changing the bottom status bar color
    }
  }, []);
  return (
    <CustomSafeAreaView>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Onboarding"
          component={UserOnboardingNavigation}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="ConfirmationSent"
          component={ConfirmationSentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Verification"
          component={VerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SupportScreen"
          component={SupportScreen}
          options={{
            headerShown: true,
            header: (props) => (
              <BaseTopBar {...props} title="Support" home={false} chevronLeft />
            ),
          }}
        />
      </Stack.Navigator>
    </CustomSafeAreaView>
  );
}

const Tabs = createBottomTabNavigator<BottomTabParamList>();
type Props = NativeStackScreenProps<RootStackParamList, "Root">;
function BottomTabNavigator(props: Props) {
  const displayBottomNav = useSelector(selectDisplayBottomNav);
  const [currentScreen, previousScreen] = useSelector(selectNavState);
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation();
  let theme: Theme;
  makeStyles((_theme: Theme) => {
    theme = _theme;
  });

  React.useEffect(() => {
    if (Platform.OS === "android") {
      setBackgroundColorAsync("white");
    } else {
      // I'm yet to find an ios alternative for changing the bottom status bar color
    }
  }, []);

  React.useEffect(() => {
    if (ScreensWithNoBottomNav.includes(previousScreen)) {
      dispatch(showBottomNav());
      // setVisibilityAsync("visible")
    }
    if (ScreensWithNoBottomNav.includes(currentScreen)) {
      dispatch(hideBottomNav());
      // doesnt seem to have any effect 👉 setVisibilityAsync("hidden")
    }
  }, [previousScreen, currentScreen]);

  const [user] = useAuthState(auth);

  React.useEffect(() => {
    if (isNull(user)) {
      props.navigation.navigate("Login");
    } else {
      dispatch(fetchOnboarding());
      dispatch(fetchUserData(null));
    }
  }, [user]);

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <Tabs.Navigator
          screenOptions={{
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
              backgroundColor: theme.colors.white,
              borderTopColor: theme.colors.background,
              elevation: 5,
              display: displayBottomNav ? "flex" : "none",
              ...(displayBottomNav
                ? null
                : {
                    height: 0,
                  }),
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.grey0,
          }}
          initialRouteName="SearchScreen"
        >
          <Tabs.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={{
              headerShown: false,
              tabBarButton: () => <></>,
            }}
          />
          <Tabs.Screen
            name="History"
            component={HistoryScreen}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <ClockIcon
                  width={24}
                  height={24}
                  fill={
                    focused ? theme.colors.primary : theme.colors.grey0?.trim()
                  }
                />
              ),
              title: "History",
              header: (props) => <BaseTopBar {...props} title="History" />,
            }}
          />
          <Tabs.Screen
            name="Upcoming"
            component={UpcomingScreen}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <ClockIcon
                  width={24}
                  height={24}
                  fill={
                    focused ? theme.colors.primary : theme.colors.grey0?.trim()
                  }
                />
              ),
              title: "Upcoming Reservations",

              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <UserIcon
                  width={24}
                  height={24}
                  fill={
                    focused ? theme.colors.primary : theme.colors.grey0?.trim()
                  }
                />
              ),
              headerShown: false,
              title: "Profile",
            }}
          />
          <Tabs.Screen
            name="ManageRes"
            component={ManageResScreen}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <ManageIcon
                  width={24}
                  height={24}
                  fill={
                    focused ? theme.colors.primary : theme.colors.grey0?.trim()
                  }
                />
              ),
              title: "Manage Res",
              header: (props) => (
                <BaseTopBar {...props} title="Manage Reservations" />
              ),
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="Issues"
            component={IssuesScreen}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <WarningIcon
                  width={24}
                  height={24}
                  fill={
                    focused ? theme.colors.primary : theme.colors.grey0?.trim()
                  }
                />
              ),
              title: "Issues",
              header: (props) => (
                <BaseTopBar {...props} title="Report Issues" />
              ),
            }}
          />
          <Tabs.Screen
            name="BookingDetails"
            options={{
              header: (props) => (
                <BaseTopBar
                  home={false}
                  chevronLeft
                  {...props}
                  title="Booking Details"
                />
              ),
              tabBarButton: () => <></>,
            }}
            component={BookingDetailsScreen}
          />
          <Tabs.Screen
            name="ReservationDetails"
            options={{
              tabBarButton: () => <></>,
            }}
            component={ReservationDetailsScreen}
          />
          <Tabs.Screen
            name="VehicleInspection"
            options={{
              tabBarButton: () => <></>,
            }}
            component={VehicleInspection}
          />
        </Tabs.Navigator>
      )}
    </ThemeConsumer>
  );
}
