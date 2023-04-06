import auth from '@react-native-firebase/auth';
export function refeshLogin() {
  const user = auth().currentUser;
  return user !== null;
}
