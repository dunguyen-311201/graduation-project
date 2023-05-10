import {TMessage} from '@types';
import {useState, useEffect} from 'react';
import firebase from '@react-native-firebase/firestore';

const useMessage = (uid?: string) => {
  const [message, setMessage] = useState<TMessage>();

  useEffect(() => {
    const fethMessage = async () => {
      if (uid) {
        const data = (await firebase().doc(`messages/${uid}`).get()).data();
        if (data) {
          setMessage({
            description: data.description,
            location: data.location,
            status: data.status,
            type: data.type,
            userId: data.userId,
            uid: data.uid,
          });
        }
        return;
      }

      setMessage(undefined);
    };

    fethMessage();
  }, [uid]);

  return {message};
};

export default useMessage;
