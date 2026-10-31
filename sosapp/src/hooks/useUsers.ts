import {useState, useEffect} from 'react';
import {doc, getDoc} from '@react-native-firebase/firestore';

import {TUser} from '@types';
import {db} from '@services';

const useUsers = (id?: string) => {
  const [user, setUser] = useState<TUser>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async (uid: string) => {
      setLoading(true);
      try {
        const data = (await getDoc(doc(db, 'users', uid))).data();

        if (data) {
          setUser({...(data as TUser), id: uid});
        }
      } catch (error) {}
      setLoading(false);
    };
    id && getUser(id);
  }, [id]);

  return {user, loading};
};

export default useUsers;
