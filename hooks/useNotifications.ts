import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { PUSH_NOTIFICATION_TOKEN_ENDPOINT } from './constants';
import { app } from '../firebase/firebaseApp';
import { useAppDispatch, useAppSelector } from '../store/store';
import { selectNotificationsEnabled, selectUpdateSettings, updateSettings } from '../store/slices/userSlice';
import useToast from './useToast';
import { tNotification } from '../store/slices/bookingSlice';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { isEmpty, isString } from 'lodash';
import { setNavScreens } from '../store/slices/navigationSlice';
import useBookingActions from './useBookingActions';
import { location_search } from '../utils/utils';
import { openChooseTimeAndBottomSheet, selectBottomSheetState, setBottomSheetNotification } from '../store/slices/mapBottomSheet';
import * as Linking from 'expo-linking'
import { selectCurrentFlow, setFlow } from '../store/slices/flowstack';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const registerForPushNotificationsAsync = async (): Promise<string> => {
  const t = await AsyncStorage.getItem("expoToken")
  if(!isEmpty(t) && isString(t)) return Promise.resolve(t)
  if (!Device.isDevice) return Promise.reject("Must use physical device for Push Notifications")
  return new Promise(async (resolve, reject) => {
    let token;

    
    await Notifications.getPermissionsAsync().then(async ({status})=>{
        if (status !== 'granted') {
            await Notifications.requestPermissionsAsync().then(async ({status})=>{
                if (status !== 'granted') {
                    return reject('Permission denied!');
                }else{
                    await Notifications.getExpoPushTokenAsync().then(async ({data})=>{
                        token = data;
                        AsyncStorage.setItem("expoToken", token)
                        return resolve(token);
                    }).catch(reject)
                }
            }).catch((e)=>{
                return reject(e)
            })
        }else{
            await Notifications.getExpoPushTokenAsync().then(async ({data})=>{
                if (Platform.OS === 'android') {
                    await Notifications.setNotificationChannelAsync('default', {
                      name: 'default',
                      importance: Notifications.AndroidImportance.MAX,
                      vibrationPattern: [0, 250, 250, 250],
                      sound: 'default',
                      lightColor: '#FF231F7C',
                      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                      bypassDnd: true,
                    });
                  }
                  /**
                   * @todo - will remove this log once testing is complete
                   */
                return resolve(data);
            }).catch(reject)
        }
    }).catch(reject)
  });
};

/**
 * @name updatePushToken
 * @param jwt
 * @param retries
 * @description if this fails, we will retry 3 times before giving up, and the error will be silently ignored
 * @returns Promise<void>
 */
const updatePushToken = (token: string, retries: number): Promise<void> | undefined => {
  if (retries > 3) return Promise.resolve();
  return getAuth(app)
    .currentUser?.getIdToken()
    .then(jwt => {
      axios
        .post(
          PUSH_NOTIFICATION_TOKEN_ENDPOINT,
          {
            token,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
              "ngrok-skip-browser-warning": "true",
            'x-user': 'CUSTOMER'
            },
          }
        )
        .catch(e => {
          /**
           * @todo - this error's priority is low and shouldn't prevent the user from continuing, so we can just log it for now
           */
          return updatePushToken(token, retries + 1);
        });
    })
    .catch(e => {
      /**
       * @todo - this error's priority is low and shouldn't prevent the user from continuing, so we can just log it for now
       */
      return updatePushToken(token, retries + 1);
    });
};

const useNotifications = () => {

    const dispatch = useAppDispatch()
    const userNotificationsEnabled = useAppSelector(selectNotificationsEnabled)
    const updateSettingsFeedback = useAppSelector(selectUpdateSettings)
    const toast = useToast()
    const mapScreenState = useAppSelector(selectBottomSheetState)
    const { setAuthCode } = useBookingActions()
    const current_flow = useAppSelector(selectCurrentFlow)

    /**
     * @name togglePushNotifications
     */
    const togglePushNotifications = () => {
        if (!userNotificationsEnabled) {
            registerForPushNotificationsAsync().then(async token => {
                await updatePushToken(token, 0)
                dispatch(updateSettings({
                    notifications_enabled: !userNotificationsEnabled
                })).unwrap().then(()=>{
                  if (current_flow === "notification_enable") {
                    dispatch(setFlow(null))
                    Linking.openURL(Linking.createURL('/map'))
                    return
                  }
                }).catch(()=>{
                  if (current_flow === "notification_enable") {
                    dispatch(setFlow(null))
                    Linking.openURL(Linking.createURL('/map'))
                    return
                  }
                })
            }).catch((e)=>{
                toast({
                    title: "Error",
                    message: "There was an error enabling push notifications",
                    type: "error",
                })
            })
        }else{
            dispatch(updateSettings({
                notifications_enabled: !userNotificationsEnabled
            }))
        }
        
    }


    /**
     * @name goToBooking
     * @description sets the booking code and opens the vehicles booking screen for only that host
     */
    const goToBooking = async (data: tNotification, link: string) => {
      location_search()
      dispatch(setBottomSheetNotification(data))
      if (mapScreenState?.authorizationOpen) {
        setAuthCode(data?.code)
        return
      } 
      if(mapScreenState?.open && !mapScreenState?.authorizationOpen){
        setAuthCode(data?.code)
        return
      }
      
      setAuthCode(data?.code)
      dispatch(openChooseTimeAndBottomSheet())
      Linking.openURL(Linking.createURL("/map")).then(()=>{
        dispatch(setNavScreens({
          current: 'MapScreen',
          previous: "SearchScreen"
        }))
      })
    
    } 

    return {
        registerForPushNotificationsAsync,
        updatePushToken,
        togglePushNotifications,
        updateSettingsFeedback,
        goToBooking
    }

};

export default useNotifications;
