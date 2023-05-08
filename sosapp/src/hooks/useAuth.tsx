import {useEffect, useState} from 'react';

import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(
    auth().currentUser,
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      }
    });

    return subscriber;
  }, [currentUser]);

  return {
    currentUser,
  };
};

export default useAuth;
