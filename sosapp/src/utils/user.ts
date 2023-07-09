import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/firestore';

const isFreeUser = async () => {
  const currentUser = auth().currentUser;
  if (currentUser) {
    const doc = await firebase()
      .doc('users/' + currentUser?.uid)
      .get();

    const data = doc.data();

    return data?.status === 'free';
  }
};

const isApprovedCenter = async () => {
  const currentUser = auth().currentUser;
  if (currentUser) {
    const doc = await firebase()
      .doc('users/' + currentUser?.uid)
      .get();

    const data = doc.data();

    return !(data && data.statusRegistration === 'approved');
  }
};

export {isFreeUser, isApprovedCenter};
