import {useContext, useEffect, useState, useCallback} from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from '@react-native-firebase/firestore';

import {TMessage} from '@types';
import {Context} from '@context';
import {db} from '@services';

const useMessages = (workerID?: string) => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const {currentUser} = useContext(Context);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const filter = workerID
      ? where('workerID', '==', workerID)
      : where(currentUser.role + 'ID', '==', currentUser.id);

    const unsubscribe = onSnapshot(
      query(collection(db, 'messages'), filter),
      snap => {
        const newData: TMessage[] = [];
        snap?.docs.forEach(d => {
          newData.push({...(d.data() as TMessage), id: d.id});
        });

        setMessages(newData.sort((a, b) => b.time - a.time));
      },
      err => console.log(err),
    );

    return () => unsubscribe();
  }, [currentUser, workerID]);

  const onDelete = useCallback(async (id: string) => {
    setLoading(true);
    await deleteDoc(doc(db, 'messages', id));
    setMessages(prev => prev.filter(msg => msg.id !== id));
    setLoading(false);
  }, []);

  const onNew = useCallback(async (mess: TMessage) => {
    setLoading(true);
    const docRef = await addDoc(collection(db, 'messages'), mess);
    setMessages(prev => [{...mess, id: docRef.id}, ...prev]);
    setLoading(false);
  }, []);

  return {messages, onDelete, onNew, loading};
};

export default useMessages;
