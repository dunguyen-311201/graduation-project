import {
  CURRENT_LOCATION,
  Route,
  MESSAGE_COMPLETED,
  MESSAGE_IN_PROGRESS,
  MESSAGE_PENDING,
} from '@constants';
import {Location, TMessage} from '@types';
import {fetchDistanceAndTime, getAsyncStorage} from '@utils';
import {useCallback, useContext, useEffect, useState} from 'react';

import {Context} from '@context';
import {EStatusUser} from '@enums';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';
import {callAPI, db} from '@services';
import {toMessage} from '../utils/request';

const useMessage = (id: string) => {
  const [message, setMessage] = useState<TMessage>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {currentUser} = useContext(Context);

  useEffect(() => {
    const unsubcribe = onSnapshot(doc(db, 'requests', id), snap => {
      const data = snap.data();
      if (data) {
        setMessage(toMessage(id, data as any));
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

      await updateDoc(doc(db, 'messages', id), update);
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

            await updateDoc(doc(db, 'users', String(currentUser?.id)), {
              location: from,
              status: EStatusUser.BUSY,
              startAt: Date.now(),
            });

            await updateDoc(doc(db, 'messages', id), update);
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

    await addDoc(collection(db, 'assigns'), {
      workerID,
      messID: id,
      time: Date.now(),
      status: MESSAGE_PENDING,
    });

    setLoading(false);
  }, []);

  const onReject = useCallback(async () => {
    if (currentUser) {
      try {
        setLoading(true);
        const document = await getDocs(
          query(
            collection(db, 'assigns'),
            where('userID', '==', currentUser.id),
            where('messID', '==', id),
          ),
        );
        const nId = document.docs.at(0)?.id;
        nId && (await updateDoc(doc(db, 'assigns', nId), {status: 'reject'}));
      } catch (err) {}
      setLoading(false);
    }
  }, [currentUser, id]);

  const onDelete = useCallback(async () => {
    setLoading(true);

    await callAPI({method: 'POST', route: `${Route.REQUESTS}/${id}/cancel`});

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
