import auth from '@react-native-firebase/auth';
export function isAuthenticated() {
  const user = auth().currentUser;
  return user !== null;
}
