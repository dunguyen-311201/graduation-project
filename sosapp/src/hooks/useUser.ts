import {useState, useEffect} from 'react';
import firebase from '@react-native-firebase/firestore';

import {TUser} from '@types';

const useUser = (uid?: string) => {
  const [user, setUser] = useState<TUser>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (uid) {
        setLoading(true);
        const data = (
          await firebase()
            .doc('users/' + uid)
            .get()
        ).data();
        if (data) {
          const _user: TUser = {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            uid,
            location: data.location,
          };
          setUser(_user);
        }
      } else {
        setUser(undefined);
      }
      setLoading(false);
    };

    fetchUser();
  }, [uid]);

  return {user, loading};
};

export default useUser;
