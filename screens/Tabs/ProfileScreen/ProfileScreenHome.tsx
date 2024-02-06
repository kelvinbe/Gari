import { Text, View, TouchableOpacity, StatusBar, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { makeStyles, ThemeConsumer, useTheme } from '@rneui/themed';
import { ProfileScreenParamList } from '../../../types';
import { Button, Divider, Icon, Image, ListItem, Switch } from '@rneui/base';
import LogoutIcon from '../../../assets/icons/logout.svg';
import HomeIcon from '../../../assets/icons/home.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllowNotifications, selectNotification, setAllowNotifications } from '../../../store/slices/notificationsSlice';
import useUserAuth from '../../../hooks/useUserAuth';
import useToast from '../../../hooks/useToast';
import { useAppSelector } from '../../../store/store';
import { selectUserProfile } from '../../../store/slices/userSlice';
import useNotifications from '../../../hooks/useNotifications';
import {Dimensions} from 'react-native';
import * as Linking from 'expo-linking'
import { selectCurrentFlow } from '../../../store/slices/flowstack';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';




type Props = NativeStackScreenProps<ProfileScreenParamList, 'ProfileScreenHome'>;

const useStyles = makeStyles((theme, props: Props) => ({
  container: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topBarContainerStyle: {
    width: '100%',
    height: 104,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  topBarCardStyle: {
    width: '90%',
    height: 96,
    backgroundColor: theme.colors.background,
    elevation: 5,
    borderRadius: 20,
    marginBottom: -46,
    position: 'relative',
    justifyContent: 'space-between',
  },
  avatarStyle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: theme.colors.white,
    overflow: 'hidden',
    position: 'absolute',
    top: -35,
    left: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImageStyle: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
  },
  editButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ADB5BD20',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0,
  },
  editButtonTextStyle: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Lato_400Regular',
    marginRight: 5,
  },
  topEditSectionContainer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 10,
    paddingBottom: 0
  },
  profileInfoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  profileInfoTextStyle: {
    color: theme.colors.title,
    fontSize: 16,
    fontWeight: '700',
  },
  profileInfoSubTextStyle: {
    color: theme.colors.subText,
    fontSize: 10,
    fontWeight: '500',
  },
  profileActionsContainer: {
    width: '100%',
    paddingTop: 30,
    paddingHorizontal: 0,
    flexDirection: 'column',
    marginTop: 35,
    marginHorizontal: 0,
  },
  actionButtonContainer: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 0,
  },
  actionButtonTextStyle: {
    color: theme.colors.title,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Lato_400Regular',
    textAlign: 'left',
  },
  listContainerStyle: {
    width: '100%',
    alignItems: 'center',
    juestifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  listItemContainerStyle: {
    width: '100%',
    padding: 0,
    margin: 0,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  listItemContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  listItemTitleStyle: {
    color: theme.colors.title,
    width: '100%',
    fontSize: 16,
    fontWeight: '500',
  },
  dividerStyle: {
    width: '100%',
    borderColor: theme.colors.divider,
  },
  notificationActionContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  notificationsLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  notificationText: {
    color: theme.colors.title,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Lato_400Regular',
    textAlign: 'left',
    width: '60%',
  },
  logoutSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30,
    justifyContent: 'flex-end',
  },
  topNavSection: {
    width: '90%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 25,
  },
  homeButtonContainer: {
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  homeButtonTextStyle: {
    color: theme.colors.black,
    fontSize: 16,
    fontWeight: '700',
    marginLeft:  10
  }
}));

const ProfileScreenHome = (props: Props) => {
  const colorAnim = useSharedValue(0)
  const {theme} = useTheme()
  const styles = useStyles(props);
  const { logOut: _logOut, userProfile } = useUserAuth();

  const profile = useAppSelector(selectUserProfile)
  const { togglePushNotifications, updateSettingsFeedback } = useNotifications()
  const current_flow = useAppSelector(selectCurrentFlow)


  useLayoutEffect(()=>{
    if(current_flow === "notification_enable" && !profile?.user_settings?.notifications_enabled){
      colorAnim.value = withRepeat(withTiming(1, { duration: 1000 }), 4, true);
    }
  }, [,current_flow])


  
  const notificationStyles = useAnimatedStyle(()=>{
    const backgroundColor = interpolateColor(colorAnim.value, [0, 1], [theme.colors.white, theme.colors.primary])
    return {
      backgroundColor
    }
  })



  const goToEdit = () => {
    props.navigation.navigate('ProfileScreenEdit');
  };
  const goToPayments = () => {
    props.navigation.navigate('PaymentDetailsScreen');
  };
  const goToLocation = () => {
    props.navigation.navigate("UserLocation")
  }
  const goToSettings = () => {
    props.navigation.navigate('ProfileSettingsScreen');
  };

  const goToAbout = () => {
    props.navigation.navigate('AboutScreen');
  };

  const goToPrivacyPolicy = () => {
    props.navigation.navigate('PrivacyPolicy');
  };

  const goToUserAgreement = () => {
    props.navigation.navigate('UserAgreement');
  };

  const goToSupport = () => {
    props.navigation.navigate('SupportScreen', {
      context: 'profile',
    });
  };

  const goToDriverLicense = () => {
    props.navigation.navigate('DriverLicenseScreen');
  };

  const goToSearch = () => {
    Linking.openURL(Linking.createURL("/search"))
  }

  const logOut = () => {
    _logOut();
  };

  

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <View style={styles.container}>
          <View style={styles.topBarContainerStyle}>
            <View style={styles.topNavSection}>
              <TouchableOpacity onPress={goToSearch} style={styles.homeButtonContainer} >
                <MaterialIcons name="arrow-back-ios" size={16} color="black" />
                <HomeIcon
                  stroke={theme.colors.black}
                  fill={theme.colors.black}
                  width={12}
                  height={12}
                />
                <Text style={styles.homeButtonTextStyle} >
                  Home
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.topBarCardStyle}>
              <View style={styles.avatarStyle}>
                <Image
                  source={{
                    uri: userProfile?.profile_pic_url ?? undefined,
                  }}
                  style={styles.avatarImageStyle}
                />
              </View>
              <View style={styles.topEditSectionContainer}>
                <TouchableOpacity onPress={goToEdit} style={styles.editButtonContainer}>
                  <Text style={styles.editButtonTextStyle}>Edit</Text>
                  <Icon name="edit" type="font-awesome" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfoContainer}>
                <Text style={styles.profileInfoTextStyle}>
                  {userProfile?.fname && userProfile?.lname
                    ? `${userProfile?.fname} ${userProfile?.lname}`
                    : 'Welcome'}
                </Text>
                <Text style={styles.profileInfoSubTextStyle}>
                  {userProfile?.handle ? `@${userProfile?.handle}` : 'Please update your profile'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.profileActionsContainer}>
            <View style={styles.listContainerStyle}>
              <ListItem
                Component={TouchableOpacity}
                containerStyle={styles.listItemContainerStyle}
                onPress={goToPayments}>
                <ListItem.Content style={styles.listItemContent}>
                  <ListItem.Title style={styles.listItemTitleStyle}>Payment</ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem
                Component={TouchableOpacity}
                containerStyle={styles.listItemContainerStyle}
                onPress={goToLocation}>
                <ListItem.Content style={styles.listItemContent}>
                  <ListItem.Title style={styles.listItemTitleStyle}>Location</ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem
                Component={TouchableOpacity}
                containerStyle={styles.listItemContainerStyle}
                onPress={goToDriverLicense}>
                <ListItem.Content style={styles.listItemContent}>
                  <ListItem.Title style={styles.listItemTitleStyle}>Driver License</ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem
                Component={TouchableOpacity}
                containerStyle={styles.listItemContainerStyle}
                onPress={goToSettings}>
                <ListItem.Content style={styles.listItemContent}>
                  <ListItem.Title style={styles.listItemTitleStyle}>Settings</ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <Animated.View style={[styles.notificationActionContainer, notificationStyles]}>
                <View style={styles.notificationsLeft}>
                  { updateSettingsFeedback.loading && <ActivityIndicator
                    color={theme.colors.primary}
                  />}
                  <Text style={styles.notificationText}>Notifications</Text>
                </View>
                <Switch
                  disabled={updateSettingsFeedback.loading}
                  thumbColor={theme.colors.primary}
                  value={profile?.user_settings?.notifications_enabled}
                  onValueChange={togglePushNotifications}
                />
              </Animated.View>
              <Divider style={styles.dividerStyle} />
              <ListItem
                Component={TouchableOpacity}
                containerStyle={styles.listItemContainerStyle}
                onPress={goToUserAgreement}>
                <ListItem.Content style={styles.listItemContent}>
                  <ListItem.Title style={styles.listItemTitleStyle}>User Agreement</ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem
                Component={TouchableOpacity}
                containerStyle={styles.listItemContainerStyle}
                onPress={goToPrivacyPolicy} // TODO Privacy Policy Page Creation(Pass in Static Data)
                >
                <ListItem.Content style={styles.listItemContent}>
                  <ListItem.Title style={styles.listItemTitleStyle}>Privacy Policy</ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem
                Component={TouchableOpacity}
                containerStyle={styles.listItemContainerStyle}
                onPress={goToSupport}>
                <ListItem.Content style={styles.listItemContent}>
                  <ListItem.Title style={styles.listItemTitleStyle}>Support</ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem
                Component={TouchableOpacity}
                containerStyle={styles.listItemContainerStyle}
                onPress={goToAbout}>
                <ListItem.Content style={styles.listItemContent}>
                  <ListItem.Title style={styles.listItemTitleStyle}>About</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </View>
          </View>
          <View style={styles.logoutSection}>
            <ListItem
              Component={TouchableOpacity}
              containerStyle={styles.listItemContainerStyle}
              onPress={logOut}>
              <ListItem.Content style={styles.listItemContent}>
                <LogoutIcon fill={theme.colors.black} />
                <ListItem.Title style={[styles.listItemTitleStyle, { marginLeft: 10 }]}>
                  Logout
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          </View>
        </View>
      )}
    </ThemeConsumer>
  );
};

export default ProfileScreenHome;
