import {useEffect, useState} from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
} from '@react-native-firebase/firestore';

import {TTask} from '@types';
import {db} from '@services';
import {toTask} from '../utils/request';

const useTasks = (workerID: string) => {
  const [tasks, setTasks] = useState<TTask[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'assignments'), where('responderId', '==', workerID)),
      snap => {
        const newData = snap?.docs.map(d => toTask(d.id, d.data() as any));

        setTasks(newData.sort((a, b) => b.time - a.time));
      },
    );

    return () => unsubscribe();
  }, [workerID]);

  return {tasks};
};

export default useTasks;
