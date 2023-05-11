import {TMessage} from '@types';
import {useState, useEffect} from 'react';
import database from '@react-native-firebase/database';

const useMessage = (uid?: string) => {
  const [message, setMessage] = useState<TMessage>();

  useEffect(() => {
    const fethMessage = async () => {
      if (uid) {
        database()
          .ref('/messages/' + uid)
          .on('value', snapshot => {
            const data = snapshot.val();
            if (data) {
              setMessage({...data});
            }
          });

        return;
      }

      setMessage(undefined);
    };

    fethMessage();
  }, [uid]);

  return {message};
};

export default useMessage;
