import {TNotification} from '@types';
import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import database from '@react-native-firebase/database';

import {Context} from '@context';

const useNotifications = () => {
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const {currentUser} = useContext(Context);

  const ref = useMemo(
    () => database().ref('notifications/' + currentUser?.id),
    [currentUser],
  );

  useEffect(() => {
    if (notifications.length > 0) {
      setLoading(false);
    }
  }, [notifications]);

  useEffect(() => {
    const query = ref.orderByPriority().limitToLast(10);

    query.on('value', snap => {
      const arr: TNotification[] = [];

      const val = snap.val();

      if (val) {
        Object.keys(val).forEach(key => {
          const data = val[key] as TNotification;
          arr.push({...data, id: key});
        });

        const sArr = arr.sort((a, b) => b.time - a.time);

        setNotifications(sArr);
      }
    });

    ref.on('child_changed', snap => {
      setNotifications(prev =>
        prev.map(n => (n.id === snap.key ? {...snap.val(), id: snap.key} : n)),
      );
    });

    ref.on('child_removed', snap => {
      setNotifications(prev => prev.filter(n => n.id !== snap.key));
    });

    return () => {
      ref.off('child_added');
      ref.off('child_changed');
      ref.off('child_removed');
    };
  }, []);

  const onDelete = useCallback(async (id: string) => {
    setLoading(true);
    await ref.child(id).remove();
    setNotifications(prev => prev.filter(n => n.id !== id));
    setLoading(false);
  }, []);

  return {notifications, loading, onDelete};
};

export default useNotifications;
