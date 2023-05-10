import {Location} from '@types';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/firestore';
import {getAsyncStorage} from './asyncStorage';
import {CURRENT_LOCATION} from '@constants';

const getUserByID = async (uid: string) => {
  return (
    await firebase()
      .doc('users/' + uid)
      .get()
  ).data();
};

const handleOnLocation = async () => {
  const currentUser = auth().currentUser;
  const deviceLocation = await getAsyncStorage<Location>(CURRENT_LOCATION);

  if (currentUser !== null) {
    await firebase()
      .doc('users/' + currentUser.uid)
      .update({deviceLocation});
  }
};

const handleOffLocation = async () => {
  const currentUser = auth().currentUser;
  if (currentUser !== null) {
    await firebase()
      .doc('users/' + currentUser.uid)
      .update({location: null});
  }
};

export {getUserByID, handleOnLocation, handleOffLocation};
