import {doc, getDoc, getFirestore} from '@react-native-firebase/firestore';
import {getAuth} from '@react-native-firebase/auth';

const getCurrentUserDoc = async () => {
  const currentUser = getAuth().currentUser;
  if (currentUser) {
    return (await getDoc(doc(getFirestore(), 'users', currentUser.uid))).data();
  }
};

const isFreeUser = async () => {
  const data = await getCurrentUserDoc();
  return data?.status === 'free';
};

const isApprovedCenter = async () => {
  const data = await getCurrentUserDoc();
  return !(data && data.statusRegistration === 'approved');
};

export {isFreeUser, isApprovedCenter};
