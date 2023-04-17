import {useCallback, useEffect, useState} from 'react';

import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      }
    });

    return subscriber;
  }, [currentUser]);

  const updateDisplayName = useCallback(async (name: string) => {
    try {
      await auth().currentUser?.updateProfile({displayName: name});
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    if (currentUser) {
      await auth().signOut();
    }
  }, [currentUser]);

  return {currentUser, handleLogout, updateDisplayName};
};

export default useAuth;
