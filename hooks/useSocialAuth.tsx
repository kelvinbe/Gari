import React, { useEffect, useState } from 'react'
import { auth } from '../firebase/firebaseApp'
import { ResponseType, makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import { FacebookAuthProvider, GoogleAuthProvider, signInWithCredential, OAuthProvider } from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import { isEmpty } from 'lodash';
import useToast from './useToast';
import { GOOGLE_CLIENT_ID, FACEBOOK_APP_ID } from "@env"
import * as Crypto from 'expo-crypto';
import { useAppDispatch } from '../store/store';
import { fetchUserData } from '../store/slices/userSlice';
import * as Linking from 'expo-linking'


WebBrowser.maybeCompleteAuthSession()

function useSocialAuth() {
    const [socialAuthLoading, setSocialAuthLoading] = useState(false)  
    const [socialAuthError, setSocialAuthError] = useState(null)
    const reduxDispatch = useAppDispatch()
    const toast = useToast()
    const [fb_request, fb_response, fb_promptAsync] = Facebook.useAuthRequest({
        expoClientId:FACEBOOK_APP_ID,
        responseType: ResponseType.Token,
        clientId: FACEBOOK_APP_ID,
    })

    const [g_request, g_response, g_promptAsync] = Google.useAuthRequest({
        expoClientId:GOOGLE_CLIENT_ID,
        responseType: ResponseType.Code,
        androidClientId: GOOGLE_CLIENT_ID,
        redirectUri: makeRedirectUri({
            scheme: "com.niebex.divvly"
        }),
        
    })

    useEffect(()=>{
        if(!isEmpty(fb_response)){
            
            if(fb_response?.type === "success"){
                setSocialAuthLoading(true)
                const { access_token } = fb_response.params
                
                const credential = FacebookAuthProvider.credential(access_token)
                signInWithCredential(auth, credential).then((credentials)=>{
                    reduxDispatch(fetchUserData(credentials.user.uid)).unwrap().then(()=>{
                        setSocialAuthLoading(false)
                    }).catch((e)=>{
                        console.log(e)
                        setSocialAuthLoading(false)
                        // console.log(error)
                        setSocialAuthError(e)
                    })
                    // console.log(credentials)
                }).catch((error)=>{
                    setSocialAuthLoading(false)
                    // console.log(error)
                    setSocialAuthError(error)
                })
            }
        }
    }, [fb_response])

    useEffect(()=>{
        // console.log(g_response)
        if(!isEmpty(g_response)){
            // console.log(g_response)
            if(g_response?.type === "success"){
                setSocialAuthLoading(true)
                const { access_token } = g_response.params
                const credential = GoogleAuthProvider.credential(null, access_token)
                signInWithCredential(auth, credential).then((credentials)=>{
                    reduxDispatch(fetchUserData(credentials.user.uid)).unwrap().then(()=>{
                        setSocialAuthLoading(false)
                    }).catch((e)=>{
                        setSocialAuthLoading(false)
                        setSocialAuthError(e)
                    })
                }).catch((e)=>{
                    setSocialAuthLoading(false)
                    setSocialAuthError(e)
                })
            }
        }
    }, [g_response])


    const appleLogin = () => {
        setSocialAuthLoading(true)
        const nonce = Math.random().toString(36).substring(2, 10);
        Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
            .then((hashedNonce) =>
                AppleAuthentication.signInAsync({
                    requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL
                    ],
                    nonce: hashedNonce
                })
            )
            .then((appleCredential) => {
                const { identityToken } = appleCredential;
                const provider = new OAuthProvider('apple.com');
                const credential = provider.credential({
                    idToken: identityToken!,
                    rawNonce: nonce
                });

                signInWithCredential(auth, credential).then((credentials)=>{
                    setSocialAuthLoading(false)
                    // console.log(credentials)
                }).catch((e)=>{
                    setSocialAuthLoading(false)
                    setSocialAuthError(e)
                })
            })
            .catch((error) => {
                console.log(error)
                if (error.code === 'ERR_CANCELED') {
                    // Silent fail
                } else {
                    toast({
                        title: "Error",
                        message: error.message,
                        type: "error",
                        duration: 5000,
                    })
                }
            });
    }


  return {
    facebookLogin: (cb?: Function)=>{
        console.log("_")
        fb_promptAsync().then((res)=>{
            cb && cb()
        }).catch((e)=>{
            console.log(e)
        })
    } ,
    googleLogin: (cb?: Function)=>{
        console.log("_")
        g_promptAsync().then((res)=>{
            cb && cb()
        }).catch((e)=>{
            console.log(e)
        })
    } ,
    socialAuthLoading,
    socialAuthError,
    appleLogin
  }
}

export default useSocialAuth