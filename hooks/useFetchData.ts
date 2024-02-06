import { useEffect, useState } from 'react';
import axios from 'axios';

import { FETCH_DATA_ENDPOINT } from './constants';
import { auth } from '../firebase/firebaseApp';


type Error = any;

export default function useFetchData(){

    const [data, setData] = useState(null)
    const [error, setError] = <Error>useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (
            async function(){
                try{
                    setLoading(true)
        auth?.currentUser?.getIdToken().then(async token => {

                    const response = await axios.get( FETCH_DATA_ENDPOINT, {
                        headers: {
                          token: `Bearer ${token}`,
                          "ngrok-skip-browser-warning": "true"
                        },
                      })
                    setData(response.data)
                }, )}catch(err){
                    setError(err)
                }finally{
                    setLoading(false)
                }
            }
        )()
    }, [setError])

    return { data, error, loading }

}