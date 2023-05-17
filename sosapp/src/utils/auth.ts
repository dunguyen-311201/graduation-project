import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

import {TUser} from '@types';

const signupByPhoneNumber = async (phone: string) => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phone);
    const verificationId = confirmation.verificationId;
    return verificationId;
  } catch (error) {}
};

const getCurrentUser = () => {
  return auth().currentUser;
};

const handleVerification = async (verificationId: string, code: string) => {
  try {
    const credential = auth.PhoneAuthProvider.credential(verificationId, code);

    const userCredential = await auth().signInWithCredential(credential);
    return userCredential;
  } catch (error) {}
};

const signupInfo = async (user: TUser) => {
  const token = await messaging().getToken();

  await firebase()
    .collection('users')
    .doc(user.uid)
    .set({...user, token});
};

const handleLastLogin = async () => {
  const currentUser = auth().currentUser;

  if (currentUser) {
    const uid = currentUser.uid;
    const token = await messaging().getToken();

    await firebase()
      .doc('users/' + uid)
      .update({uid, token, lastLogin: Date.now()});
  }
};

const handleLogout = async () => {
  const currentUser = getCurrentUser();
  if (currentUser !== null) {
    const uid = currentUser.uid;
    await firebase().doc(`users/${uid}`).update({lastLogin: null, uid});
    await auth().signOut();
  }
};

export {
  handleLogout,
  handleLastLogin,
  handleVerification,
  signupByPhoneNumber,
  signupInfo,
  getCurrentUser,
};
