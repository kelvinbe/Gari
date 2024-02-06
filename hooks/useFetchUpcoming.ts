import {useState} from 'react'
import { RESERVATIONS_ENDPOINT } from './constants';
import { useDispatch } from 'react-redux';
import { selectUpcomingReservations, setGetUpcomingReservations } from '../store/slices/upcomingReservationSlice';
import apiClient from '../utils/apiClient';
import { useAppSelector } from '../store/store';

type Error = any;

export default function useFetchUpcoming(){

    const [error, setError] = <Error>useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const data = useAppSelector(selectUpcomingReservations)

    const fetchUpcoming = () => {
        setLoading(true)
        return apiClient.get(RESERVATIONS_ENDPOINT, {
            params: {
                status: "UPCOMING"
            }
        }).then(({data})=>{
            dispatch(setGetUpcomingReservations(data))
        }).catch((e)=>{
            setError(e)
        }).finally(()=>{
            setLoading(false)
        })
    }

    return { data, error, loading, fetchUpcoming }
}