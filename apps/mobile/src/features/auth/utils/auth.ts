import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
} from '@react-native-firebase/auth';

const signInByPhoneNumber = async (phoneNumber: string) => {
  return await signInWithPhoneNumber(getAuth(), phoneNumber);
};

const verificationPhone = async (verificationId: string, code: string) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    return await signInWithCredential(getAuth(), credential);
  } catch (error) {}
};

export {verificationPhone, signInByPhoneNumber};
