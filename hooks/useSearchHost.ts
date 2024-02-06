import { useEffect, useState } from 'react';
import axios from 'axios';
import { SEARCH_BY_HOST_ENDPOINT } from './constants';
import { auth } from '../firebase/firebaseApp';


interface  SearchHost{
    hostId: string
}


type Error = any;

export default function useSearchHost(props: SearchHost){

    const [data, setData] = useState(null)
    const [error, setError] = <Error>useState(null)
    const [loading, setLoading] = useState(false)

    const {hostId} = props

    useEffect(() => {
        (
            async function(){
                try{
                    setLoading(true)
        auth?.currentUser?.getIdToken().then(async token => {

                    const response = await axios.get(SEARCH_BY_HOST_ENDPOINT,{
                        headers: {
                          token: `Bearer ${token}`,
                          "ngrok-skip-browser-warning": "true"
                        },
                        params: {
                            host_id: hostId
                        },
                      })
                    setData(response.data)
                })}catch(err){
                    setError(err)
                }finally{
                    setLoading(false)
                }
            }
        )()
    }, [setError])

    return { data, error, loading }

}