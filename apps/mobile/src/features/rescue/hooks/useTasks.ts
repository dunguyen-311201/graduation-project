import {useContext, useEffect, useState} from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
} from '@react-native-firebase/firestore';

import {TTask} from '@types';
import {Context} from '@context';
import {ERole} from '@enums';
import {db} from '@services';
import {toTask} from '../utils/request';

const useTasks = (workerID: string) => {
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [ready, setReady] = useState(false);

  const {currentUser} = useContext(Context);

  useEffect(() => {
    setReady(false);

    const unsubscribe = onSnapshot(
      // A center must filter by itself too, or the read rule rejects the query.
      currentUser?.role === ERole.CENTER
        ? query(
            collection(db, 'assignments'),
            where('responderId', '==', workerID),
            where('centerId', '==', currentUser.id),
          )
        : query(
            collection(db, 'assignments'),
            where('responderId', '==', workerID),
          ),
      snap => {
        const newData = snap?.docs.map(d => toTask(d.id, d.data() as any));

        setTasks(newData.sort((a, b) => b.time - a.time));
        setReady(true);
      },
      () => setReady(true),
    );

    return () => unsubscribe();
  }, [currentUser, workerID]);

  return {tasks, ready};
};

export default useTasks;
