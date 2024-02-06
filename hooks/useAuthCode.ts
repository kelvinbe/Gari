import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { AUTH_CODE_ENDPOINT, REQUEST_AUTH_CODE_ENDPOINT } from './constants';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebaseApp';
import useToast from './useToast';
import { isEmpty } from 'lodash';
import apiClient from '../utils/apiClient';
import { useAppDispatch, useAppSelector } from '../store/store';
import { selectUserProfile } from '../store/slices/userSlice';
import * as Linking from 'expo-linking';
import { setFlow } from '../store/slices/flowstack';

type tResponse = {
    data: Record<string, string> | null;
    loading: boolean;
    error: object | null;
}

type RequestAuthCodeFn = ( data: {
    host_id?: string,
    vehicle_id: string
} ) => Promise<void>


type VerifyAuthCodeFn = (code?: string | null) => Promise<string | null | undefined>

export default function useAuthCode(){
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUserProfile)
    const [requestAuthCodeResponse, setRequestAuthCodeResponse] = useState<tResponse>({
        data: null,
        loading: false,
        error: null
    })
    const [verifyAuthCodeResponse, setVerifyAuthCodeResponse] = useState<tResponse>({
        data: null,
        loading: false,
        error: null
    })
    const toast = useToast()


    /**
     * @name requestAuthCode
     * @description send an authcode request to the server
     */
    const requestAuthCode: RequestAuthCodeFn = async (data) => {

        if(!user?.user_settings?.notifications_enabled) {
            dispatch(setFlow('notification_enable'))
            Linking.openURL(Linking.createURL('/profile'))
            .then(()=>{
                toast({
                    title: "Enable Notifications",
                    message: "You need to enable notifications to request an auth code",
                    type: "primary"
                })
            })
        }else {
            setRequestAuthCodeResponse((prev)=>({
                ...prev,
                loading: true
            }))
            return getAuth(app).currentUser?.getIdToken().then(async (token)=>{
                return await axios.post(REQUEST_AUTH_CODE_ENDPOINT, {
                    ...data
                }, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "x-user": "CUSTOMER",
                        "ngrok-skip-browser-warning": "true"
                    }
                }).then(({data})=>{
                    toast({
                        title: "Auth Code Requested",
                        message: "Wait for the host to approve your request",
                        type: "success"
                    })
                    setRequestAuthCodeResponse((prev)=>({
                        ...prev,
                        data: data.data,
                        loading: false
                    }))
                }).catch((e: AxiosError)=>{
                    toast({
                        title: "Error",
                        message: "Something went wrong",
                        type: "error"
                    })
                    setRequestAuthCodeResponse((prev)=>({
                        ...prev,
                        error: e.response?.data as object,
                        loading: false
                    }))
                })
            }).catch((e: AxiosError)=>{
                toast({
                    title: "Error",
                    message: "Something went wrong",
                    type: "error"
                })
                setRequestAuthCodeResponse((prev)=>({
                    ...prev,
                    error: e.response?.data as object,
                    loading: false
                }))
            })  

        }
    }

    /**
     * @name verifyAuthCode
     * @description verify the auth code
     * 
     */

    const verifyAuthCode: VerifyAuthCodeFn = async (code) => {
        if (isEmpty(code)) {
            setVerifyAuthCodeResponse((prev)=>({
                ...prev,
                error: {
                    message: "Code is empty"
                }
            }))
            return Promise.reject(null)
        }
        setVerifyAuthCodeResponse((prev)=>({
            ...prev,
            loading: true
        }))

        try {
            const data = (await apiClient.get(AUTH_CODE_ENDPOINT, {
                params: {
                    code
                }
            })).data 

            setVerifyAuthCodeResponse((prev)=>({
                ...prev,
                data: data?.code, // the verified auth code
                loading: false
            }))
            toast({
                title: "Auth Code Verified",
                message: "You can now start the vehicle",
                type: "success"
            })
            return data?.code
        } catch (e) {
            toast({
                title: "Error",
                message: "Enter a valid code",
                type: "error"
            })
            setVerifyAuthCodeResponse((prev)=>({
                ...prev,
                error: {
                    message: "Is the code correct?"
                },
                loading: false
            }))
            return Promise.reject(null)
        }
    }


    return {
        requestAuthCode,
        requestAuthCodeResponse,
        verifyAuthCode,
        verifyAuthCodeResponse
    }

}