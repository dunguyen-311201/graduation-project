import {useEffect, useState} from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
} from '@react-native-firebase/firestore';

import {TTask} from '@types';
import {db} from '@services';

const useTasks = (workerID: string) => {
  const [tasks, setTasks] = useState<TTask[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'assigns'), where('workerID', '==', workerID)),
      snap => {
        const newData: TTask[] = [];
        snap?.docs.forEach(d => {
          newData.push({...(d.data() as TTask), id: d.id});
        });

        setTasks(newData.sort((a, b) => b.time - a.time));
      },
    );

    return () => unsubscribe();
  }, [workerID]);

  return {tasks};
};

export default useTasks;
