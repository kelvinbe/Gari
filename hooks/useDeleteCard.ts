import { useState } from 'react';
import axios from 'axios';

import { DELETE_CARD_ENDPOINT } from './constants';
import { auth } from '../firebase/firebaseApp';

type Error = any;

export default function useDeleteCard() {

  const [data, setData] = useState(null);
  const [error, setError] = <Error>useState(null);
  const [loading, setLoading] = useState(false);

  const deleteCard = (cardNum:string) => {
    try {
      setLoading(true);
      auth?.currentUser?.getIdToken().then(async token => {
        const response = await axios.delete(DELETE_CARD_ENDPOINT, {
          headers: {
            token: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
          params: {
            card_id: cardNum
          }
        });
        if(cardNum){
          setData(response.data);
        }else{
          setError('Something went wrong. Try again later')
        }
      });
    } catch (err) {
      
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return { data, error, loading, deleteCard };
}
