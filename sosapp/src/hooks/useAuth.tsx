import {useCallback, useEffect, useState} from 'react';
import message from '@react-native-firebase/messaging';

import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/firestore';
import {TUser} from '@types';
import useDeviceLocation from './useDeviceLocation';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User>();
  const {deviceLocation} = useDeviceLocation();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      }
    });

    return subscriber;
  }, [currentUser]);

  const handleLogout = useCallback(async () => {
    if (currentUser) {
      await auth().signOut();
    }
  }, [currentUser]);

  const signupByPhoneNumber = useCallback(async (phone: string) => {
    const confirmation = await auth().signInWithPhoneNumber(phone);
    const verificationId = confirmation.verificationId;
    return verificationId;
  }, []);

  const handleVerification = useCallback(
    async (verificationId: string, code: string) => {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        code,
      );

      const userCredential = await auth().signInWithCredential(credential);
      return userCredential;
    },
    [],
  );

  const signupInfo = useCallback(
    async (user: TUser) => {
      const token = await message().getToken();
      await firebase()
        .collection('users')
        .add({...user, token, location: deviceLocation});
    },
    [deviceLocation],
  );

  const reload = useCallback(async () => {
    let _currentUser = await auth().currentUser;
    if (_currentUser !== null) {
      await _currentUser.reload();
    }
  }, []);

  return {
    currentUser,
    handleLogout,
    signupByPhoneNumber,
    handleVerification,
    signupInfo,
    reload,
  };
};

export default useAuth;
