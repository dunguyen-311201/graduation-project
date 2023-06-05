import {useState, useContext, useEffect} from 'react';
import database from '@react-native-firebase/database';

import {TMessage} from '@types';
import {EMessage} from '@enums/EMessage';
import {callAPI} from '@services/api';
import {Route} from '@constants/api';
import {Context} from '@context';

const useMessage = (uid?: string) => {
  const [message, setMessage] = useState<TMessage>();
  const [loading, setLoading] = useState(false);

  const {removeMessage, currentUser} = useContext(Context);

  useEffect(() => {
    const fethMessage = async () => {
      setLoading(true);
      if (uid) {
        database()
          .ref('/messages/' + uid)
          .on('value', snapshot => {
            const data = snapshot.val();
            if (data) {
              setMessage({...data});
            } else {
              database()
                .ref('/messages/' + uid)
                .off('value');

              uid && removeMessage(uid);

              setMessage(undefined);
            }
          });
      } else {
        setMessage(undefined);
      }

      setLoading(false);
    };

    fethMessage();
  }, [removeMessage, uid]);

  const onComfirm = async () => {
    if (uid) {
      return await callAPI({
        data: {
          status: EMessage.MESSAGE_IN_PROGRESS,
          serviceId: currentUser?.uid,
        },
        method: 'PUT',
        route: `${Route.MESSAGE}/${uid}`,
      });
    }
  };

  const onComplete = async () => {
    if (uid) {
      return await callAPI({
        data: {
          status: EMessage.MESSAGE_COMPLETED,
          serviverId: currentUser?.uid,
        },
        method: 'PUT',
        route: `${Route.MESSAGE}/${uid}`,
      });
    }
  };

  return {message, onComfirm, loading, onComplete};
};

export default useMessage;
