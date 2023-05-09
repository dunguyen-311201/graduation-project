import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/firestore';

import {getAsyncStorage} from './asyncStorage';
import {CURRENT_LOCATION} from '@constants';
import {Location} from '@types';

const getUser = async () => {
  const currentUser = auth().currentUser;

  if (currentUser !== null) {
    return (
      await firebase()
        .doc('users/' + currentUser.uid)
        .get()
    ).data();
  }
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

export {getUser, handleOnLocation, handleOffLocation};
