import { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase/firebaseApp';

type Error = any;

export default function useFetchDivvlyInfo(endpointPath:string){

    const [data, setData] = useState<any>(null)
    const [error, setError] = <Error>useState(null)
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState<string|null>(null)
    auth?.currentUser?.getIdToken().then((response) => {
        setToken(response)
    })

    const fetchDivvlyInfo = async() => {
        setLoading(true)

        return axios.get(endpointPath, {
            headers: {
                token: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true"
            },
        })
        .then((data) => {
            return data
            
        })
        .catch(err => {
            return err
        })
        .finally( () => {
            setLoading(false)
        })
    }
    useEffect(()=> {
        fetchDivvlyInfo().then(setData).catch(err => setError(err))
    }, [])

    return { data, error, loading, fetchDivvlyInfo }
}