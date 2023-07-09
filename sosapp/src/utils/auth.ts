import auth from '@react-native-firebase/auth';

const signInByPhoneNumber = async (phoneNumber: string) => {
  return await auth().signInWithPhoneNumber(phoneNumber);
};

const verificationPhone = async (verificationId: string, code: string) => {
  try {
    const credential = auth.PhoneAuthProvider.credential(verificationId, code);

    const userCredential = await auth().signInWithCredential(credential);
    return userCredential;
  } catch (error) {}
};

export {verificationPhone, signInByPhoneNumber};
