import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/firestore';

import {Location, TUser} from '@types';
import {getAsyncStorage} from './asyncStorage';
import {CURRENT_LOCATION} from '@constants/cache';
import {getLocation} from './location';

const getUserByID = async (uid: string) => {
  const data = (
    await firebase()
      .doc('users/' + uid)
      .get()
  ).data();

  if (data) {
    const user: TUser = {...data};
    return user;
  }

  return null;
};

const handleOnLocation = async () => {
  const currentUser = auth().currentUser;

  const location = await getAsyncStorage<Location>(CURRENT_LOCATION);

  if (currentUser !== null) {
    await firebase()
      .doc('users/' + currentUser.uid)
      .update({location});
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
