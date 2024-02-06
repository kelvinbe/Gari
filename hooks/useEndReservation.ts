import {useEffect, useState} from 'react';
import axios from 'axios';
import {END_RESERVATION_ENDPOINT} from './constants'
import {auth} from '../firebase/firebaseApp';
import { useDispatch } from 'react-redux';
import { setEndReservationStatus } from '../store/slices/endReservationSlice';
import { IReservation } from '../types';



type Error = any


export default function useEndReservation(id: string){

    const [data, setData] = useState(null)
    const [error, setError] = <Error>useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()


    const endReservation = () => {

        try {
            setLoading(true)
            auth?.currentUser?.getIdToken().then(async token => {
                const response = await axios.put(END_RESERVATION_ENDPOINT, {
                    params:{
                        id
                    },
                    headers: {
                        token: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true"
                    },
                });
                setData(response.data);
                dispatch(setEndReservationStatus())
            });
            
        } catch (error) {
            setError(error)
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        endReservation()
    }, [])

    return { data, error, loading, endReservation}
}