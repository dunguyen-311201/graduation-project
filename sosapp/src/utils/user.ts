import firebase from '@react-native-firebase/firestore';

const getUserById = async (userId: string) => {
  const user = (
    await firebase()
      .doc('users/' + userId)
      .get()
  ).data();

  return user;
};

export {getUserById};
