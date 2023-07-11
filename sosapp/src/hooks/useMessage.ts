import {
  CURRENT_LOCATION,
  MESSAGE_COMPLETED,
  MESSAGE_IN_PROGRESS,
  MESSAGE_PENDING,
} from '@constants';
import {Location, TMessage} from '@types';
import {fetchDistanceAndTime, getAsyncStorage} from '@utils';
import {useCallback, useContext, useEffect, useState} from 'react';

import {Context} from '@context';
import {EStatusUser} from '@enums';
import firebase from '@react-native-firebase/firestore';

const useMessage = (id: string) => {
  const [message, setMessage] = useState<TMessage>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {currentUser} = useContext(Context);

  useEffect(() => {
    const unsubcribe = firebase()
      .doc('messages/' + id)
      .onSnapshot(snap => {
        const data = snap.data() as TMessage;
        if (data) {
          const mess: any = {...data, id};
          setMessage(mess);
        }
      });

    return () => unsubcribe();
  }, [currentUser, id]);

  const onComplete = useCallback(async () => {
    setLoading(true);

    try {
      const update = {
        status: MESSAGE_COMPLETED,
        endAt: Date.now(),
        userCompleted: currentUser?.id,
      };

      await firebase()
        .doc('messages/' + id)
        .update(update);
    } catch (err: any) {
      setError(err);
    }

    setLoading(false);
  }, [currentUser?.id, id]);

  const onComfirm = useCallback(async () => {
    if (message) {
      setLoading(true);
      try {
        const from = await getAsyncStorage<Location>(CURRENT_LOCATION);
        const to = message.location;
        if (from && to) {
          const res = await fetchDistanceAndTime({to, from});

          if (res) {
            const {distance, timeout} = res;

            const update = {
              status: MESSAGE_IN_PROGRESS,
              workerID: currentUser?.id,
              startAt: Date.now(),
              distance,
              timeout,
            };

            await firebase()
              .doc('users/' + currentUser?.id)
              .update({
                location: from,
                status: EStatusUser.BUSY,
                startAt: Date.now(),
              });

            await firebase()
              .doc('messages/' + id)
              .update(update);
          }
        }
      } catch (err: any) {
        setError(err);
      }

      setLoading(false);
    }
  }, [currentUser?.id, id, message]);

  const onAssign = useCallback(async (workerID: string) => {
    setLoading(true);

    await firebase()
      .collection('assigns')
      .add({workerID, messID: id, time: Date.now(), status: MESSAGE_PENDING});

    setLoading(false);
  }, []);

  const onReject = useCallback(async () => {
    if (currentUser) {
      try {
        setLoading(true);
        const document = await firebase()
          .collection('assigns')
          .where('userID', '==', currentUser.id)
          .where('messID', '==', id)
          .get();
        const nId = document.docs.at(0)?.id;
        await firebase()
          .doc('assigns/' + nId)
          .update({status: 'reject'});
      } catch (err) {}
      setLoading(false);
    }
  }, [currentUser, id]);

  const onDelete = useCallback(async () => {
    setLoading(true);

    await firebase()
      .doc('messages/' + id)
      .delete();

    setLoading(false);
  }, [id]);

  return {
    message,
    error,
    loading,
    onComfirm,
    onComplete,
    onReject,
    onDelete,
    onAssign,
  };
};

export default useMessage;
