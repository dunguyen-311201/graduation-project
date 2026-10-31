import {useCallback, useContext, useEffect, useState} from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from '@react-native-firebase/firestore';

import {Context} from '@context';
import {TNotification} from '@types';
import {db} from '@services';

const useNotifications = () => {
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const {currentUser} = useContext(Context);

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userID', '==', currentUser.id),
    );

    const unsubscribe = onSnapshot(q, snap => {
      const newData: TNotification[] = [];
      snap?.docs.forEach(d => {
        newData.push({...(d.data() as TNotification), id: d.id});
      });

      setNotifications(newData.sort((a, b) => b.time - a.time));
    });

    return () => unsubscribe();
  }, [currentUser?.id]);

  const onDelete = useCallback(async (id: string) => {
    setLoading(true);
    await deleteDoc(doc(db, 'notifications', id));
    setNotifications(prev => prev.filter(n => n.id !== id));
    setLoading(false);
  }, []);

  return {notifications, loading, onDelete};
};

export default useNotifications;
