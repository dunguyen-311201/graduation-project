import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/firestore';
import {TUser} from '@types';
import {useCallback} from 'react';

const useAuth = () => {
  // const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(
  //   auth().currentUser,
  // );

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(user => {
  //     setCurrentUser(user);
  //   });

  //   return subscriber;
  // }, []);

  const updateProfile = async (name: string) => {
    await auth().currentUser?.updateProfile({displayName: name});
  };

  const signOut = async () => {
    await auth().signOut();
  };

  const upgrade = useCallback(async (user: TUser) => {
    const {email, phoneNumber, uid, citizenIdentification} = user;
    if (email) {
      await auth().currentUser?.updateEmail(email);
      await firebase()
        .doc('users/' + uid)
        .update({citizenIdentification, email});
    } else if (phoneNumber) {
      // const snapshot = await auth().verifyPhoneNumber(phoneNumber);
      // const credential = auth.PhoneAuthProvider.credential(
      //   snapshot.verificationId,
      //   snapshot.code,
      // );
    }
  }, []);

  const signInByPhoneNumber = async (phoneNumber: string) => {
    return await auth().signInWithPhoneNumber(phoneNumber);
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
    updateProfile,
    signOut,
    signInByPhoneNumber,
    verification,
    upgrade,
  };
};

export default useAuth;
