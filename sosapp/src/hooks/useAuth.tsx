import {create} from 'zustand';
import auth from '@react-native-firebase/auth';
// import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const useAuth = create(() => ({
  user: auth().currentUser,
  isAuthenticated: auth().currentUser !== null,
  signupByPhone: async (phone: string) => {
    const confirmation = await auth().signInWithPhoneNumber(phone, true);
    return confirmation;
  },
  // signupByFacebook: async () => {
  //   const result = await LoginManager.logInWithPermissions([
  //     'public_profile',
  //     'email',
  //   ]);

  //   if (result.isCancelled) {
  //     throw 'User cancelled the login process';
  //   }

  //   const data = await AccessToken.getCurrentAccessToken();

  //   if (!data) {
  //     throw 'Something went wrong obtaining access token';
  //   }

  //   const facebookCredential = auth.FacebookAuthProvider.credential(
  //     data.accessToken,
  //   );

  //   return auth().signInWithCredential(facebookCredential);
  // },
  signupByGoogle: async () => {
    // await GoogleSignin.hasPlayServices();
    // const {idToken} = await GoogleSignin.signIn();
    // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // return auth().signInWithCredential(googleCredential);
  },
  logout: async () => {
    await auth().signOut();
  },
}));
