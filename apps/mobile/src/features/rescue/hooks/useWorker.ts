import {useCallback, useContext, useEffect, useState} from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';

import {Alert} from 'react-native';
import {Context} from '@context';
import {TUser} from '@types';
import {db} from '@services';

const useWorker = (free?: boolean) => {
  const [workers, setData] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {currentUser} = useContext(Context);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    // Who can take a mission lives in `responders`, the same data the API checks.
    const source = free
      ? query(
          collection(db, 'responders'),
          where('centerId', '==', currentUser.id),
          where('availability', '==', 'AVAILABLE'),
        )
      : query(collection(db, 'users'), where('centerID', '==', currentUser.id));

    const unsubscribe = onSnapshot(
      source,
      snap => {
        setData(snap?.docs.map(d => ({id: d.id, ...d.data()}) as TUser) ?? []);
      },
      err => console.log(err),
    );

    return () => unsubscribe();
  }, [currentUser, free]);

  const deleteWorker = useCallback(async (id: string) => {
    Alert.alert(
      'Delete Worker',
      'Are you sure you want to delete this Worker?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteDoc(doc(db, 'users', id));
            } catch (err: any) {
              setError(err);
            }
            setLoading(false);
          },
        },
      ],
    );
  }, []);

  const activeWorker = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', id), {disabled: false});
    } catch (err: any) {
      setError(err);
    }
    setLoading(false);
  }, []);

  return {
    workers,
    loading,
    error,
    deleteWorker,
    activeWorker,
  };
};

export default useWorker;
