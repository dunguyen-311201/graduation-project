import {useContext, useEffect, useState, useCallback} from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
} from '@react-native-firebase/firestore';

import {TMessage} from '@types';
import {Context} from '@context';
import {ERole} from '@enums';
import {Route} from '@constants';
import {callAPI, db} from '@services';
import {toMessage, toRaiseSosBody} from '../utils/request';

const useMessages = (workerID?: string) => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const {currentUser} = useContext(Context);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    // Matches the read rule: participants, or centers that were notified.
    const filter =
      currentUser.role === ERole.CENTER
        ? where('notifiedCenterIds', 'array-contains', currentUser.id)
        : where('participantIds', 'array-contains', workerID ?? currentUser.id);

    const unsubscribe = onSnapshot(
      query(collection(db, 'requests'), filter),
      snap => {
        const newData = snap?.docs.map(d => toMessage(d.id, d.data() as any));

        setMessages(newData.sort((a, b) => b.time - a.time));
      },
      err => console.log(err),
    );

    return () => unsubscribe();
  }, [currentUser, workerID]);

  const onDelete = useCallback(async (id: string) => {
    setLoading(true);
    await callAPI({method: 'POST', route: `${Route.REQUESTS}/${id}/cancel`});
    setLoading(false);
  }, []);

  const onNew = useCallback(async (mess: TMessage) => {
    setLoading(true);
    try {
      const res = await callAPI({
        method: 'POST',
        route: Route.REQUESTS,
        data: toRaiseSosBody(mess.id, mess),
      });
      if (res.status >= 400) {
        throw new Error(res.data?.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {messages, onDelete, onNew, loading};
};

export default useMessages;
