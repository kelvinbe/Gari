import AsyncStorage from '@react-native-async-storage/async-storage'
import { createSlice } from '@reduxjs/toolkit'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth/react-native'
import { isEmpty } from 'lodash'
import React, { useReducer, useEffect } from 'react'
import {  auth } from '../firebase/firebaseApp'
import { clearUserState, fetchUserData, selectAuthProviders, selectPasswordChanged, selectUserProfile, setPasswordChanged, updateUserData } from '../store/slices/userSlice'
import { useAppDispatch, useAppSelector } from '../store/store'
import useToast from './useToast'



interface IReducerState {
  signInLoading: boolean,
  signUpLoading: boolean,
  logOutLoading: boolean,
  signInError: string,
  signUpError: string,
  logOutError: string,
  updateProfileLoading: boolean,
  updateProfileError: string,
  loadingPasswordUpdate: boolean,
  passwordUpdateError: string,
}

const initialState: IReducerState = {
  signInLoading: false,
  signUpLoading: false,
  logOutLoading: false,
  signInError: "",
  signUpError: "",
  logOutError: "",
  updateProfileError: "",
  updateProfileLoading: false,
  loadingPasswordUpdate: false,
  passwordUpdateError: ""
}

const hookSlice = createSlice({
  name: "hookSlice",
  initialState,
  reducers: {
    setSignInLoading: (state, action) => {
      state.signInLoading = action.payload
      state.signInError =  action.payload ? "" : state.signInError
    },
    setSignUpLoading: (state, action) => {
      state.signUpLoading = action.payload
      state.signInError =  action.payload ? "" : state.signInError
    },
    setLogOutLoading: (state, action) => {
      state.logOutLoading = action.payload
      state.signInError =  action.payload ? "" : state.signInError
    },
    setSignInError: (state, action) => {
      state.signInError = action.payload
      state.signInLoading = false
    },
    setSignUpError: (state, action) => {
      state.signUpError = action.payload
      state.signUpLoading = false
    },
    setLogOutError: (state, action) => {
      state.logOutError = action.payload
      state.logOutLoading = false
    },
    setUpdateProfileLoading: (state, action) => {
      state.updateProfileLoading = action.payload
      state.updateProfileError = action.payload ? "" : state.updateProfileError
    },
    setUpdateProfileError: (state, action) => {
      state.updateProfileError = action.payload
      state.updateProfileLoading = false
    },
    setLoadingPasswordUpdate: (state, action) => {
      state.loadingPasswordUpdate = action.payload
      state.passwordUpdateError = action.payload ? "" : state.passwordUpdateError
    },
    setPasswordUpdateError: (state, action) => {
      state.passwordUpdateError = action.payload
      state.loadingPasswordUpdate = false
    }
  }
})

const reducer = hookSlice.reducer

const { setSignInError, setLogOutError, setLogOutLoading, setSignInLoading, setSignUpError, setSignUpLoading, setUpdateProfileError, setUpdateProfileLoading, setLoadingPasswordUpdate, setPasswordUpdateError } = hookSlice.actions

function useUserAuth() {
    const  toast = useToast()
    const [{
      signInLoading,
      logOutError,
      logOutLoading,
      signInError,
      signUpError,
      signUpLoading,
      updateProfileLoading,
      updateProfileError,
      loadingPasswordUpdate,
      passwordUpdateError
    }, dispatchAction] = useReducer(reducer, initialState)
    const reduxDispatch = useAppDispatch()
    //handle errors
    const handleFirebaseAuthError = (e: any) =>{
      switch(e){
          case "Firebase: Error (auth/invalid-email).":
              toast({
                  message: "Invalid Email",
                  type: "error",
                  title: "Error",
                  duration: 3000
              })
              break;
          case "Firebase: Error (auth/user-disabled).":
              toast({
                  message: "User Disabled",
                  type: "error",
                  title: "Error",
                  duration: 3000
              })
              break;
          case "Firebase: Error (auth/user-not-found).":
              toast({
                  message: "User Not Found",
                  type: "error",
                  title: "Error",
                  duration: 3000
              })
              break;
          case "Firebase: Error (auth/wrong-password).":
              toast({
                  message: "Wrong Password",
                  type: "error",
                  title: "Error",
                  duration: 3000
              })
              break;
          default:
              toast({
                  message: "Something went wrong",
                  type: "error",
                  title: "Error",
                  duration: 4000
              })
        }
    }
    //handle errors
    useEffect(()=>{
        if(!isEmpty(signInError)){
            handleFirebaseAuthError(signInError)
            dispatchAction(setSignInError(""))
        }
        if(!isEmpty(logOutError)){
            handleFirebaseAuthError(logOutError)
            dispatchAction(setLogOutError(""))
        }
        if(!isEmpty(signUpError)){
            handleFirebaseAuthError(signUpError)
            dispatchAction(setSignUpError(""))
        }
    }, [signInError, logOutError, signUpError])

    //handle success
    const handleSuccess = (type: "signUp" | "signIn" | "logOut", silent?: boolean) => {
      switch(type){
        case "signUp":
          dispatchAction(setSignUpLoading(false))
          return !silent && toast({
            message: "Sign Up Successful",
            type: "success",
            title: "Success",
            duration: 2000
          })
        case "signIn":
          dispatchAction(setSignInLoading(false))
          return !silent && toast({
            message: "Sign In Successful",
            type: "success",
            title: "Success",
            duration: 2000
          })
        case "logOut":
          dispatchAction(setLogOutLoading(false))
          return !silent && toast({
            message: "Log Out Successful",
            type: "success",
            title: "Success",
            duration: 2000
          })
      }
    }
    /**
     * @name signUp  
     * @description Sign up a user with email and password
     * @param email
     * @param password
     * @return Promise with userCredential
     */
    const signUp = (email: string, password: string, silent?: boolean) => {
        dispatchAction(setSignUpLoading(true))
        return createUserWithEmailAndPassword(auth, email, password).then((userCredential)=>{
            handleSuccess("signUp", silent || true)
        }).catch((e)=>{
            dispatchAction(setSignUpError(e.message))
        })
    }
    /**
     * @name signOut
     * @description Sign out a user
     * @return Promise with void
     */
    const logOut = (silent?: boolean) => {
      dispatchAction(setLogOutLoading(true))
      auth.signOut().then(()=>{
        reduxDispatch(clearUserState())
        handleSuccess("logOut", silent || true)
        AsyncStorage.clear()
      }).catch((e)=>{
        dispatchAction(setLogOutError(e.message))
      })
    }
    /**
     * @name signIn
     * @description Sign in a user
     * @param email
     * @param password
     */
    const signIn = (email: string, password: string, silent?: boolean) => {
      dispatchAction(setSignInLoading(true))
      signInWithEmailAndPassword(auth, email, password).then((credentials)=>{
        reduxDispatch(fetchUserData(null)).then((info)=>{
          handleSuccess("signIn", silent || true)
        }).catch((e)=>{
          dispatchAction(setSignInError("Error Fetching User Data"))
        })
      }).catch((e)=>{
        dispatchAction(setSignInError(e.message))
      })
    }


    /**
     * @section user state from store
     */
  const userProfile = useAppSelector(selectUserProfile)
    const userAuthProviders = useAppSelector(selectAuthProviders)
    const hasPasswordChanged = useAppSelector(selectPasswordChanged)


    /**
     * @section user  related functions
     */

    /**
     * @name updateUserProfile
     * @description Update user profile
     * @param data
     */
  const updateUserProfile = (data: any) => {
      /**to simulate loading, adding timeout */
      dispatchAction(setUpdateProfileLoading(true))
      setTimeout(()=>{
        reduxDispatch(updateUserData(data)).unwrap().then(()=>{
          dispatchAction(setUpdateProfileLoading(false))
          toast({
            message: "Profile Updated",
            type: "success",
            title: "Success",
            duration: 2000
          })
        }).catch((e)=>{ 
          dispatchAction(setUpdateProfileError(e.message))
        })
      }, 2000)
    }
    
    /**
     * @name updateUserPassword
     * @description Update user password
     * @param password
     */

    const updateUserPassword = (password: string, currentPassword: string) => {
      dispatchAction(setLoadingPasswordUpdate(true))
      Promise.all([
        userAuthProviders?.includes("password") ? new Promise((res, rej)=>{
          const user = auth?.currentUser
          const cred = EmailAuthProvider.credential(user?.email as string, currentPassword)
          return reauthenticateWithCredential(user as any, cred).then(()=>{
            res(true)
          }).catch((e)=>[
            rej(e)
          ])
        }) : true
      ]).then(()=>{
        !isEmpty(auth.currentUser) && updatePassword(auth.currentUser as any, password).then(()=>{
          reduxDispatch(setPasswordChanged())
          dispatchAction(setLoadingPasswordUpdate(false))
          toast({
            message: "Password Updated",
            type: "success",
            title: "Success",
            duration: 2000
          })
        }).catch((e)=>{
          dispatchAction(setPasswordUpdateError(e.message))
        })
      }).catch((e)=>{
        dispatchAction(setPasswordUpdateError("Current Password is wrong"))
      })
    }

  return {
    signUp,
    logOut,
    signIn,
    signInLoading,
    logOutLoading,
    signUpLoading,
    signInError,
    logOutError,
    signUpError,
    userProfile,
    updateUserProfile,
    updateProfileLoading,
    updateProfileError,
    updateUserPassword,
    loadingPasswordUpdate,
    passwordUpdateError,
    userAuthProviders,
    hasPasswordChanged
  }
}

export default useUserAuth