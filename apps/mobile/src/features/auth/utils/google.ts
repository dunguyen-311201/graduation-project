import {GoogleAuthProvider, signInWithCredential} from '@react-native-firebase/auth';

import {ENV} from '@constants';
import {auth} from '@services';

// Loaded on demand: importing it in a build without the native module would
// crash the app at start.
const googleSignin = async () => {
  const {GoogleSignin} = await import(
    '@react-native-google-signin/google-signin'
  );
  GoogleSignin.configure({webClientId: ENV.GOOGLE_WEB_CLIENT_ID});
  return GoogleSignin;
};

/** Returns the Firebase user, or null when the person closes the picker. */
const signInWithGoogle = async () => {
  const GoogleSignin = await googleSignin();
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

  const response = await GoogleSignin.signIn();
  if (response.type !== 'success' || !response.data.idToken) {
    return null;
  }

  const credential = GoogleAuthProvider.credential(response.data.idToken);
  const {user} = await signInWithCredential(auth, credential);
  return user;
};

// Otherwise the picker reuses the old account on the next sign-in.
const signOutOfGoogle = async () => {
  const GoogleSignin = await googleSignin();
  await GoogleSignin.signOut();
};

export {signInWithGoogle, signOutOfGoogle};
