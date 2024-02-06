import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { API_KEY, AUTH_DOMAIN, MESSAGING_SENDER_ID, PROJECT_ID, STORAGE_BUCKET, APP_ID } from "@env"
import { getReactNativePersistence, initializeAuth, Auth, getAuth } from 'firebase/auth/react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

let app: FirebaseApp;
let auth: Auth;
if (getApps().length < 1) {
  app = initializeApp(firebaseConfig, "divvly");
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence({
      getItem(...args){
        // console.log("getting item:: ",...args)
        return AsyncStorage.getItem(...args)
      },
      setItem(...args){
        // console.log("setting items:: ", ...args)
        return AsyncStorage.setItem(...args)
      },
      removeItem(...args){
        // console.log("removing items:: ", ...args)
        return AsyncStorage.removeItem(...args)
      }
    }),
  });
} else {
  app = getApp();
  console.log("replacing::", app.name)
  console.log("initializing auth")
  auth = getAuth(app);
}

export { app, auth };
