import {TMessage} from '@types';
import {useState, useEffect} from 'react';
import firebase from '@react-native-firebase/firestore';

const useMessage = (mId: string) => {
  const [message, setMessage] = useState<TMessage>();

  useEffect(() => {
    const fethMessage = async () => {
      const data = await firebase().doc(`messages/${mId}`).get();
      console.log(data);
    };

    fethMessage();
  }, [mId]);

  return {message};
};

export default useMessage;
