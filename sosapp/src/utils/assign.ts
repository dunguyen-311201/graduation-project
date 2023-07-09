import firebase from '@react-native-firebase/firestore';

export const rejectAssign = async (id: string) => {
  await firebase()
    .doc('assigns/' + id)
    .update({status: 'reject'});
};
