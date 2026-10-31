import {doc, getFirestore, updateDoc} from '@react-native-firebase/firestore';

export const rejectAssign = async (id: string) => {
  await updateDoc(doc(getFirestore(), 'assigns', id), {status: 'reject'});
};
