import {Route} from '@constants';
import {TMessage} from '@types';
import {useCallback, useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {Context} from '@context';
import {doc, onSnapshot} from '@react-native-firebase/firestore';
import {callAPI, db} from '@services';
import {toMessage} from '../utils/request';

const useMessage = (id: string) => {
  const [message, setMessage] = useState<TMessage>();
  const [loading, setLoading] = useState(false);

  const {currentUser} = useContext(Context);

  useEffect(() => {
    const unsubcribe = onSnapshot(
      doc(db, 'requests', id),
      snap => {
        const data = snap.data();
        if (data) {
          setMessage(toMessage(id, data as any));
        }
      },
      // A worker loses read access as soon as they reject or time out.
      () => setMessage(undefined),
    );

    return () => unsubcribe();
  }, [currentUser, id]);

  // Every state change is a command; the screen follows through onSnapshot.
  const command = useCallback(async (route: string, data?: object) => {
    const res = await callAPI({method: 'POST', route, data});
    if (res.status >= 400) {
      Alert.alert('Could not complete this', res.data?.message || 'Please try again.');
    }
    return res.status < 400;
  }, []);

  const run = useCallback(async (work: () => Promise<unknown>) => {
    setLoading(true);
    await work();
    setLoading(false);
  }, []);

  const onComplete = useCallback(
    () => run(() => command(`${Route.REQUESTS}/${id}/complete`)),
    [command, id, run],
  );

  const onComfirm = useCallback(
    () =>
      run(() =>
        command(`${Route.ASSIGNMENTS}/${message?.assignmentId}/accept`),
      ),
    [command, message?.assignmentId, run],
  );

  const onReject = useCallback(
    () =>
      run(() =>
        command(`${Route.ASSIGNMENTS}/${message?.assignmentId}/reject`),
      ),
    [command, message?.assignmentId, run],
  );

  // Claiming again is a no-op, so this also works after a failed assignment.
  const onAssign = useCallback(
    (responderId: string) =>
      run(
        async () =>
          (await command(`${Route.REQUESTS}/${id}/claim`)) &&
          command(`${Route.REQUESTS}/${id}/assignments`, {responderId}),
      ),
    [command, id, run],
  );

  const onDelete = useCallback(
    () => run(() => command(`${Route.REQUESTS}/${id}/cancel`)),
    [command, id, run],
  );

  return {
    message,
    loading,
    onComfirm,
    onComplete,
    onReject,
    onDelete,
    onAssign,
  };
};

export default useMessage;
