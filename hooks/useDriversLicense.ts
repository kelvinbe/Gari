import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { auth } from '../firebase/firebaseApp'
import { SET_DRIVERS_LICENCE_ENDPOINT } from "./constants";
import { setDriversLicenseUrl } from "../store/slices/driversLicenseSlice";


export interface driversLicense{
    //TODO: Change this to an image type after integration with Idverify is done.
    driversLicense: string
}

type Error = any

export default function useDriversLicense(props: driversLicense) {

    const [data, setData] = useState(null);
    const [error, setError] = <Error>useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()

    const {driversLicense} = props


    const setDriversLicense = () => {

        try {
            auth.currentUser?.getIdToken().then(async token => {
                const response = await axios.post(
                SET_DRIVERS_LICENCE_ENDPOINT,{
                    drivers_license: driversLicense
                },
                {
                    headers: {
                        token: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true"
                    }
                }    

                );
                setData(response.data)
                dispatch(setDriversLicenseUrl(driversLicense))
            })
            
        } catch (error) {
            setError(error)
            
        }finally{
            setLoading(false)
        }
    }
    useEffect(() => {
        setDriversLicense();
    }, [])


    return {data, error, loading, setDriversLicense}

}