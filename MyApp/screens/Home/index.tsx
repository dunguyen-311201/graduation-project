import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useCallback} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {RootScreenNavigationProps} from '../../navigation/RootNavigation';
import {BUTTON, SCREEN} from '../../enums';
import {CustomButton, CustomText} from '../../components';

const HomeScreen = () => {
  const {setOptions} =
    useNavigation<RootScreenNavigationProps<SCREEN.SLASH_SCREEN>>();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '933989208887-fd3ap44odkf3c0ub07s67t3bcccplofk.apps.googleusercontent.com',
    });

    setOptions({
      headerShown: false,
    });
  }, [setOptions]);

  const onGoogleButtonPress = useCallback(async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    // Get the users ID token
    const userInfo = await GoogleSignin.signIn();
    const {idToken} = userInfo;

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return await auth().signInWithCredential(googleCredential);
  }, []);

  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <Button
        title="Google Sign-In"
        onPress={() =>
          onGoogleButtonPress().then(() =>
            console.log('Signed in with Google!'),
          )
        }
      />
      <CustomButton label="Login" type={BUTTON.OUTLINE} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
