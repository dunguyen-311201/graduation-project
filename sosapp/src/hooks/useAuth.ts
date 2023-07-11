import {FIRST_INSTALLED, USER_CACHE} from '@constants';
import {getAsyncStorage, setAsyncStorage} from '@utils';
import {useCallback, useEffect, useState} from 'react';

import {ERole} from '@enums';
import {TUser} from '@types';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unSubscribe = auth().onAuthStateChanged(async user => {
      try {
        if (user) {
          await auth().currentUser?.reload();
        } else {
          setCurrentUser(null);
        }
      } catch (error) {}
    });

    return () => unSubscribe();
  }, []);

  useEffect(() => {
    const unSubscribe = auth().onUserChanged(async user => {
      try {
        if (user && user.displayName) {
          const data = (
            await firebase()
              .doc('users/' + user.uid)
              .get()
          ).data() as TUser;

          if (data) {
            setCurrentUser({...data, id: user.uid});
            await setAsyncStorage(FIRST_INSTALLED, 1);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {}
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      if (currentUser) {
        const update = {
          lastLogin: null,
          ...(currentUser.role === ERole.WORKER &&
            currentUser.status === 'free' && {status: 'unavailable'}),
        };

        await firebase()
          .doc('users/' + currentUser.id)
          .update(update);

        await auth().signOut();
        setIsAuthenticated(false);
      }
    } catch (err) {}
    setLoading(false);
  }, [currentUser]);

  const signUp = useCallback(async () => {
    setLoading(true);
    try {
      const {uid, phoneNumber} = auth().currentUser || {};

      if (phoneNumber && uid) {
        const token = await messaging().getToken();

        const data = await getAsyncStorage<TUser>(USER_CACHE);
        let u: TUser;
        if (data) {
          u = {
            ...data,
            token,
            lastLogin: Date.now(),
            status: 'free',
            phoneNumber,
          };

          if (data.role === ERole.CENTER) {
            u = {
              ...u,
              timeRegistration: Date.now(),
              status: 'unavailable',
              statusRegistration: 'pending',
            };
          }

          await firebase()
            .doc('users/' + uid)
            .set(u);
          await auth().currentUser?.updateProfile({...u});
        }
      }
    } catch (error) {}
    setLoading(false);
  }, []);

  const signIn = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const token = await messaging().getToken();
      const doc = firebase().doc('users/' + id);
      const data = (await doc.get()).data();

      if (data) {
        await doc.update({
          token,
          lastLogin: Date.now(),
          ...(data.role === ERole.WORKER &&
            data.status === 'unavailable' &&
            !data.disable && {status: 'free'}),
        });
      }
    } catch (error) {}
    setLoading(false);
  }, []);

  const updateProfile = useCallback(async (update: TUser) => {
    setLoading(true);
    try {
      const current = auth().currentUser;

      if (current) {
        await firebase()
          .doc('users/' + current.uid)
          .update(update);

        await current.updateProfile(update);
      }
    } catch (error) {}
    setLoading(false);
  }, []);

  return {
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    currentUser,
    loading,
    updateProfile,
  };
};

export default useAuth;
