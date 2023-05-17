import {useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(
    auth().currentUser,
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return subscriber;
  }, []);

  const updateProfile = async (name: string) => {
    await auth().currentUser?.updateProfile({displayName: name});
    setCurrentUser(auth().currentUser);
  };

  const signOut = async () => {
    await auth().signOut();
  };

  const signInByPhoneNumber = async (phoneNumber: string) => {
    return (await auth().signInWithPhoneNumber(phoneNumber)).verificationId;
  };

  const verification = async (verificationId: string, code: string) => {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        code,
      );

      const userCredential = await auth().signInWithCredential(credential);
      return userCredential;
    } catch (error) {}
  };

  return {
    currentUser,
    updateProfile,
    signOut,
    signInByPhoneNumber,
    verification,
  };
};

export default useAuth;
