import {useState, useEffect, useCallback} from 'react';
import firebase from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {ERole} from '@enums';
import {TUser} from '@types';
import {getAsyncStorage, setAsyncStorage} from '@utils';
import {FIRST_INSTALLED, USER_CACHE} from '@constants';

const useAuth = () => {
  const [user, setUser] = useState<TUser>();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(
    auth().currentUser,
  );

  useEffect(() => {
    const unSubscribe = auth().onAuthStateChanged(_user => {
      if (_user && _user.displayName) {
        setCurrentUser(_user);
        setIsAuthenticated(true);
      }
    });

    return () => unSubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    const setup = async () => {
      if (currentUser && currentUser.displayName && isAuthenticated) {
        try {
          setLoading(true);
          const {displayName, uid, email, photoURL, phoneNumber} = currentUser;
          const snap = await firebase()
            .doc('users/' + uid)
            .get();

          if (snap.exists) {
            const data: any = {
              ...snap.data(),
              displayName,
              id: uid,
              email,
              photoURL,
              phoneNumber,
            };
            setUser(data);
          }
        } catch (error) {}
      }
      setLoading(false);
    };

    setup();
  }, [currentUser, isAuthenticated]);

  const signOut = useCallback(async () => {
    try {
      if (user) {
        setLoading(true);

        const update = {
          lastLogin: null,
          ...(user.role === ERole.WORKER &&
            user.status === 'free' && {status: 'unavailable'}),
        };
        await firebase()
          .doc('users/' + user.id)
          .update(update);
        await auth().signOut();
      }
    } catch (err) {}
    setIsAuthenticated(false);
    setLoading(false);
  }, [user]);

  const signUp = useCallback(async () => {
    const {uid, phoneNumber} = auth().currentUser || {};

    if (phoneNumber && uid) {
      try {
        setLoading(true);
        const token = await messaging().getToken();

        const data = await getAsyncStorage<TUser>(USER_CACHE);
        let u: TUser;
        if (data) {
          await auth().currentUser?.updateProfile({
            displayName: data.displayName,
          });

          u = {
            ...data,
            role: ERole.USER,
            token,
            lastLogin: Date.now(),
            status: 'free',
            phoneNumber,
          };

          if (data.role === ERole.CENTER) {
            u = {
              ...u,
              role: ERole.CENTER,
              timeRegistration: Date.now(),
              status: 'unavailable',
              statusRegistration: 'pending',
            };
          }

          await firebase()
            .doc('users/' + uid)
            .set(u);

          await setAsyncStorage(FIRST_INSTALLED, 1);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setLoading(false);
      }
    }
  }, []);

  const signIn = useCallback(async (id: string) => {
    try {
      setLoading(true);
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

        await setAsyncStorage(FIRST_INSTALLED, 1);
        setIsAuthenticated(true);
      }
    } catch (error) {}
    setLoading(false);
  }, []);

  return {
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    currentUser: user,
    loading,
  };
};

export default useAuth;
