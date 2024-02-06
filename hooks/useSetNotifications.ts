import { useEffect, useState } from 'react';
import axios from 'axios';
import { SEND_NOTIFICATION_TOKEN_ENDPOINT } from './constants';
import { auth } from '../firebase/firebaseApp';

interface Iprops {
  notification: boolean;
}
type Error = any;

export default function useSetNotifications(props: Iprops) {
  const { notification } = props;

  const [data, setData] = useState(null);
  const [error, setError] = <Error>useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function() {
      try {
        setLoading(true);
        auth?.currentUser?.getIdToken().then(async token => {
          const response = await axios.post(
            SEND_NOTIFICATION_TOKEN_ENDPOINT,
            {
              notification
            },
            {
              headers: {
                token: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true"
              },
            }
          );
          setData(response.data);
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [setError, notification]);
  return { data, error, loading }
}