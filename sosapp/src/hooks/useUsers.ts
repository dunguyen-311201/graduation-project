import {useState, useEffect} from 'react';
import firebase from '@react-native-firebase/firestore';

import {TUser} from '@types';

const useUsers = (id?: string) => {
  const [user, setUser] = useState<TUser>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const doc = await firebase()
          .doc('users/' + id)
          .get();
        const data: any = doc.data();

        if (data) {
          setUser({...data, id});
        }
      } catch (error) {}
      setLoading(false);
    };
    id && getUser();
  }, [id]);

  return {user, loading};
};

export default useUsers;
