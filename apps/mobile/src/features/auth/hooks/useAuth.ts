import {FIRST_INSTALLED, Route, USER_CACHE} from '@constants';
import {getAsyncStorage, setAsyncStorage} from '@utils';
import {useCallback, useEffect, useState} from 'react';
import {
  onAuthStateChanged,
  reload,
  signOut as firebaseSignOut,
  updateProfile as updateAuthProfile,
} from '@react-native-firebase/auth';
import type {User as AuthUser} from '@react-native-firebase/auth';
import {doc, getDoc, setDoc, updateDoc} from '@react-native-firebase/firestore';
import {getToken} from '@react-native-firebase/messaging';

import {ERole} from '@enums';
import {TUser} from '@types';
import {auth, callAPI, db, messaging} from '@services';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);
  // True until the saved session has been checked once.
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Loads the users/{uid} profile, which only exists once sign-up has finished.
  // Accounts made in the Firebase console have no displayName, so that is not
  // checked. The namespaced onUserChanged listener no longer exists in the
  // modular API, so this runs after sign-in and profile updates.
  const loadProfile = useCallback(async (user: AuthUser | null) => {
    try {
      if (user) {
        const data = (await getDoc(doc(db, 'users', user.uid))).data() as
          | TUser
          | undefined;

        // Signed out while the profile was loading: do not sign back in.
        if (data && auth.currentUser?.uid === user.uid) {
          setCurrentUser({...data, id: user.uid});
          await setAsyncStorage(FIRST_INSTALLED, 1);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async user => {
      try {
        if (user) {
          await reload(user);
          await loadProfile(auth.currentUser);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
      setInitializing(false);
    });

    return () => unSubscribe();
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    setLoading(true);
    // A failed clean-up must never keep the person signed in.
    try {
      if (currentUser) {
        const update = {
          lastLogin: null,
          ...(currentUser.role === ERole.WORKER &&
            currentUser.status === 'free' && {status: 'unavailable'}),
        };

        await updateDoc(doc(db, 'users', currentUser.id), update);

        const token = await getToken(messaging).catch(() => null);
        if (token) {
          await callAPI({method: 'DELETE', route: Route.FCM_TOKEN, data: {token}});
        }
        if (currentUser.role === ERole.WORKER) {
          await callAPI({
            method: 'PUT',
            route: Route.AVAILABILITY,
            data: {availability: 'OFF_DUTY'},
          });
        }
      }
    } catch (err) {}
    try {
      await firebaseSignOut(auth);
    } catch (err) {}
    setLoading(false);
  }, [currentUser]);

  const signUp = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      const {uid, phoneNumber} = user || {};

      if (user && phoneNumber && uid) {
        const token = await getToken(messaging);

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

          await setDoc(doc(db, 'users', uid), u);
          await updateAuthProfile(user, {
            displayName: u.displayName,
            photoURL: u.photoURL,
          });
          await loadProfile(auth.currentUser);
        }
      }
    } catch (error) {}
    setLoading(false);
  }, [loadProfile]);

  const signIn = useCallback(
    async (id: string) => {
      setLoading(true);
      let hasProfile = false;
      try {
        // A device without a push token can still sign in.
        const token = await getToken(messaging).catch(() => null);
        const ref = doc(db, 'users', id);
        const data = (await getDoc(ref)).data();

        if (data) {
          hasProfile = true;
          await updateDoc(ref, {
            ...(token && {token}),
            lastLogin: Date.now(),
            ...(data.role === ERole.WORKER &&
              data.status === 'unavailable' &&
              !data.disable && {status: 'free'}),
          });
          if (token) {
            await callAPI({
              method: 'PUT',
              route: Route.FCM_TOKEN,
              data: {token},
            });
          }
          if (data.role === ERole.WORKER) {
            await callAPI({
              method: 'PUT',
              route: Route.AVAILABILITY,
              data: {availability: 'AVAILABLE'},
            });
          }
          await loadProfile(auth.currentUser);
        }
      } catch (error) {}
      setLoading(false);
      return hasProfile;
    },
    [loadProfile],
  );

  const updateProfile = useCallback(
    async (update: TUser) => {
      setLoading(true);
      try {
        const current = auth.currentUser;

        if (current) {
          await updateDoc(doc(db, 'users', current.uid), update);

          await updateAuthProfile(current, {
            ...(update.displayName !== undefined && {
              displayName: update.displayName,
            }),
            ...(update.photoURL !== undefined && {photoURL: update.photoURL}),
          });
          await loadProfile(auth.currentUser);
        }
      } catch (error) {}
      setLoading(false);
    },
    [loadProfile],
  );

  return {
    isAuthenticated,
    initializing,
    signIn,
    signUp,
    signOut,
    currentUser,
    loading,
    updateProfile,
  };
};

export default useAuth;
