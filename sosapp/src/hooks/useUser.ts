import {useCallback, useEffect, useState} from 'react';
import firebase from '@react-native-firebase/firestore';
import {TUser} from '@types';

const useUser = (init: TUser) => {
  const [user, setUser] = useState<TUser>(init);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        setLoading(true);
        const {uid} = user;
        if (uid) {
          const _user = (
            await firebase().collection('users').where('uid', '==', uid).get()
          ).docs[0]?.data();

          setUser(_user);
        }
        // fetch('', {
        //   body: JSON.stringify(user),
        //   headers: {'Content-Type': 'application/json'},
        //   method: 'POST',
        // });
      } catch (_error: any) {
        setError(_error);
      }
      setLoading(false);
    };
    handleFetchData();
  }, [user]);

  const handleChange = useCallback(async (data?: TUser) => {
    if (data) {
      setUser(data);
    }
  }, []);

  return {onChange: handleChange, user, loading, error};
};

export default useUser;
