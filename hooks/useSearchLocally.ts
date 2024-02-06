import { useEffect, useState } from 'react';
import axios from 'axios';
import { SEARCH_LOCALLY_ENDPOINT } from './constants';
import { auth } from '../firebase/firebaseApp';

interface SearchLocally{
    marketId: string
}

type Error = any;

export default function useSearchLocally(props: SearchLocally){

    const [data, setData] = useState(null)
    const [error, setError] = <Error>useState(null)
    const [loading, setLoading] = useState(false)
    const {marketId} = props

    useEffect(() => {
        (
            async function(){
                try{
                    setLoading(true)
        auth?.currentUser?.getIdToken().then(async token => {

                    const response = await axios.get(SEARCH_LOCALLY_ENDPOINT, {
                        headers: {
                          token: `Bearer ${token}`,
                          "ngrok-skip-browser-warning": "true"
                        },
                        params: {
                            market_id: marketId
                        }
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