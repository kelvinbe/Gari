import { useState, useEffect } from "react";
import axios from 'axios';
import { app } from '../firebase/firebaseApp'
import { DRIVER_CREDENTIALS_ENDPOINT} from "./constants";
import { getAuth } from "firebase/auth";
import useToast from "./useToast";
import apiClient from "../utils/apiClient";



export default function useEditDriversLicense() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast()

    /**
     * @name updateDriverCredentials 
     * @description updates the driver's credentials
     * @param {"front"| "back"} side - the side of the drivers license to update
     * @param {string} license - the url of the drivers license
     */

    async function updateDriverCredentials( side: string, license: string ) {
        await getAuth(app)?.currentUser?.getIdToken().then(async (token)=>{
            setLoading(true)
            await apiClient.put(DRIVER_CREDENTIALS_ENDPOINT, {
                [`drivers_licence_${side}`]: license
            }).then(()=>{
                setLoading(false);
            }).catch((e)=>{
                toast({
                    message: "There was an error updating your drivers license. Please try again later.",
                    type: "error"
                })
                setError(e);
            }).finally(()=>{
                setLoading(false);
            })
        })
    }

    return {
        updateDriverCredentials,
        loading,
        error
    }

}