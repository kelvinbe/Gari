import { useEffect, useState } from 'react';
import axios from 'axios';
import { CANCEL_BOOKING_ENDPOINT } from './constants';
import { auth } from '../firebase/firebaseApp';
import { useDispatch } from 'react-redux';
import { setStatus } from '../store/slices/cancelSlice';

type Error = any;

export default function useCancelBooking(id: string){
    const dispatch = useDispatch();

    const [data, setData] = useState(null)
    const [error, setError] = <Error>useState(null)
    const [loading, setLoading] = useState(false)

    const cancelBooking = () => {
        try {
        setLoading(true);
        auth?.currentUser?.getIdToken().then(async token => {
            const response = await axios.put(CANCEL_BOOKING_ENDPOINT, {
            params: {
                id,
            },
            headers: {
                token: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true"
            },
            });
            setData(response.data);
            dispatch(setStatus());
        });
        } catch (err) {
        setError(err);
        } finally {
        setLoading(false);
        }
    };
    useEffect(() => {
        cancelBooking()
    },[])
    return { data, error, loading, cancelBooking };
}