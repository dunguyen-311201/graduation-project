import {useCallback, useContext, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {Context} from '@context';
import {getAsyncStorage, setAsyncStorage} from '@utils';

// Personal data that other users must not see (users/{id} is readable by every
// signed-in user), so it stays on this device, scoped to the signed-in account.
const useDeviceStore = <T,>(name: string, initial: T) => {
  const {currentUser} = useContext(Context);
  const key = currentUser ? `${name}:${currentUser.id}` : null;

  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  // Re-read on focus so a change made on another screen shows up here.
  useFocusEffect(
    useCallback(() => {
    if (!key) {
      return;
    }
    let alive = true;
    getAsyncStorage<T>(key).then(stored => {
      if (alive) {
        stored !== null && setValue(stored);
        setReady(true);
      }
    });
    return () => {
      alive = false;
    };
    }, [key]),
  );

  const save = useCallback(
    async (next: T) => {
      setValue(next);
      key && (await setAsyncStorage(key, next));
    },
    [key],
  );

  return {value, save, ready};
};

export default useDeviceStore;
