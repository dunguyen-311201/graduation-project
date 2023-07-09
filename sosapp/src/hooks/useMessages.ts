import firebase from '@react-native-firebase/firestore';
import {useContext, useEffect, useState, useCallback} from 'react';

import {Context} from '@context';
import {TMessage} from '@types';

const useMessages = (workerID?: string) => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const {currentUser} = useContext(Context);

  useEffect(() => {
    if (currentUser) {
      try {
        const collection = firebase().collection('messages');

        let query;
        if (workerID) {
          query = collection.where('workerID', '==', workerID);
        } else {
          query = collection.where(
            currentUser.role + 'ID',
            '==',
            currentUser.id,
          );
        }

        const unsubcribe = query.onSnapshot(snap => {
          const newData: TMessage[] = [];
          snap?.docs.forEach(doc => {
            const id = doc.id;
            const data = doc.data() as TMessage;
            newData.push({...data, id});
          });

          setMessages(newData.sort((a, b) => b.time - a.time));
        });

        return () => unsubcribe();
      } catch (error) {}
    }
  }, [currentUser, workerID]);

  const onDelete = useCallback(async (id: string) => {
    setLoading(true);
    await firebase()
      .doc('messages/' + id)
      .delete();
    setMessages(prev => prev.filter(msg => msg.id !== id));
    setLoading(false);
  }, []);

  const onNew = useCallback(async (mess: TMessage) => {
    setLoading(true);
    const docRef = await firebase().collection('messages').add(mess);
    setMessages(prev => [{...mess, id: docRef.id}, ...prev]);
    setLoading(false);
  }, []);

  return {messages, onDelete, onNew, loading};
};

export default useMessages;
