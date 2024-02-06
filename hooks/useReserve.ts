import { useEffect, useState } from 'react';
import axios from 'axios';
import { RESERVE_ENDPOINT } from './constants';
import { auth } from '../firebase/firebaseApp';


interface Reservation {
    entityId: string,
    locationId: string,
    vehicleId: string,
    startDateTime: string,
    endDateTime: string,
    hourlyRate: string,
    totalCost: string,
    paymentId: string
};
type Error = any;

export default function useReserve(props: Reservation){

    const {
        entityId,
        locationId,
        vehicleId,
        startDateTime,
        endDateTime,
        hourlyRate,
        totalCost,
        paymentId
    } = props;

    const [data, setData] = useState(null)
    const [error, setError] = <Error>useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (
            async function(){
                try{
                    setLoading(true)
        auth?.currentUser?.getIdToken().then(async token => {

                    const response = await axios.post(RESERVE_ENDPOINT, {
                        entity_id: entityId,
                        location_id: locationId,
                        vehicle_id: vehicleId,
                        start_date_time: startDateTime,
                        end_date_time: endDateTime,
                        hourly_rate: hourlyRate,
                        total_cost: totalCost,
                        payment_id: paymentId
                    }, {
                        headers: {
                          token: `Bearer ${token}`,
                          "ngrok-skip-browser-warning": "true"
                        },
                      });
                    setData(response.data);
                })} catch(err){
                    setError(err)
                } finally{
                    setLoading(false)
                }
            }
        )()
    }, [
        setError,
        entityId,
        locationId,
        vehicleId,
        startDateTime,
        endDateTime,
        hourlyRate,
        totalCost,
        paymentId])

    return { data, error, loading }

}