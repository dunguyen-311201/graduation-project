import {useCallback, useContext, useEffect, useState} from 'react';

import {Context} from '@context';
import {TNotification} from '@types';
import firebase from '@react-native-firebase/firestore';

const useNotifications = () => {
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const {currentUser} = useContext(Context);

  useEffect(() => {
    const unsubscribe = firebase()
      .collection('notifications')
      .where('userID', '==', currentUser?.id)
      .onSnapshot(snap => {
        const newData: TNotification[] = [];
        snap?.docs.forEach(doc => {
          const id = doc.id;
          const data = doc.data() as TNotification;
          newData.push({...data, id});
        });

        setNotifications(newData.sort((a, b) => b.time - a.time));
      });

    return () => unsubscribe();
  }, []);

  const onDelete = useCallback(async (id: string) => {
    setLoading(true);
    await firebase()
      .doc('notifications/' + id)
      .delete();
    setNotifications(prev => prev.filter(n => n.id !== id));
    setLoading(false);
  }, []);

  return {notifications, loading, onDelete};
};

export default useNotifications;
