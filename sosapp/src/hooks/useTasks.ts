import {useEffect, useState} from 'react';
import firebase from '@react-native-firebase/firestore';

import {TTask} from '@types';

const useTasks = (workerID: string) => {
  const [tasks, setTasks] = useState<TTask[]>([]);

  useEffect(() => {
    const unsubcribe = firebase()
      .collection('assigns')
      .where('workerID', '==', workerID)
      .onSnapshot(snap => {
        const newData: TTask[] = [];

        snap?.docs.forEach(doc => {
          const data = doc.data() as TTask;
          const id = doc.id;
          newData.push({...data, id});
        });

        setTasks(newData.sort((a, b) => b.time - a.time));
      });

    return () => unsubcribe();
  }, [workerID]);

  return {tasks};
};

export default useTasks;
