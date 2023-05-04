import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/firestore';

import {TUser} from '@types';

const signupByPhoneNumber = async (phone: string) => {
  const confirmation = await auth().signInWithPhoneNumber(phone);
  const verificationId = confirmation.verificationId;
  return verificationId;
};

const handleVerification = async (verificationId: string, code: string) => {
  try {
    const credential = auth.PhoneAuthProvider.credential(verificationId, code);

    const userCredential = await auth().signInWithCredential(credential);
    return userCredential;
  } catch (error) {
    return null;
  }
};

const signupInfo = async (user: TUser) => {
  await firebase().collection('users').doc(user.uid).set(user);
};

const reload = async () => {
  let _currentUser = await auth().currentUser;
  if (_currentUser !== null) {
    await _currentUser.reload();
  }
};

const checkSignup = async (uid: string) => {
  try {
    const user = (
      await firebase().collection('users').where('uid', '==', uid).get()
    ).docs[0].data();

    return user !== undefined;
  } catch (error) {
    return false;
  }
};

const handleUpdateProfile = async (displayName: string) => {
  await auth().currentUser?.updateProfile({displayName, photoURL: ''});
};

const handleUpdateInfo = async (user: TUser) => {
  await firebase()
    .doc(`users/${user.uid}`)
    .update({...user});
};

const handleLogout = async () => {
  await auth().signOut();
};

export {
  handleLogout,
  handleUpdateInfo,
  handleVerification,
  signupByPhoneNumber,
  reload,
  handleUpdateProfile,
  signupInfo,
  checkSignup,
};
