import {useContext, useEffect, useState} from 'react';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';

import {TMessage} from '@types';
import {Context} from '@context';

const useMessages = (type: number = 0) => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {currentUser} = useContext(Context);

  useEffect(() => {
    const handleSubcribeData = async (
      snapshot: FirebaseDatabaseTypes.DataSnapshot,
    ) => {
      if (snapshot.val()) {
        let val;
        let message;
        const resutls = await Promise.all(
          Object.keys(snapshot.val()).map(async key => {
            val = (
              await database()
                .ref('/messages/' + key)
                .once('value')
            ).val();

            message = {
              uid: val.uid,
              type: val.type,
              description: val.description,
              userId: val.userId,
              location: val.location,
              status: val.status,
              serviceId: val.serviceId,
            };
            return message;
          }),
        );
        setMessages(resutls);
        setLoading(false);
      }
    };
    const getData = async () => {
      setLoading(true);

      try {
        if (currentUser?.uid) {
          setLoading(true);
          const ref = database().ref(
            '/user-messages/' + currentUser.uid + '/' + type,
          );

          ref.on('value', handleSubcribeData);
          ref.on('child_removed', handleSubcribeData);
        }
      } catch (err: any) {
        setError(err);
      }
      setLoading(false);
    };

    getData();
  }, [currentUser?.uid, type]);

  return {messages, loading, error};
};

export default useMessages;
