import {Platform, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation/RootNavigation';
import {getAsyncStorage} from '@utils/asyncStorage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Geolocation from '@react-native-community/geolocation';

import {EScreen} from '@enums';
import ScreenBase from '@components/ScreenBase';
import {BackHandler} from 'react-native';

const HomeScreen = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.HOME>>();

  async function getUser() {
    const user = await getAsyncStorage<FirebaseAuthTypes.UserCredential>(
      'user',
    );
    const user1 = auth().currentUser;
    console.log(user, user1);
  }
  useEffect(() => {
    Geolocation.getCurrentPosition(info => console.log(info));

    setOptions({headerShown: false});
    getUser();
  }, [navigate, setOptions]);

  useEffect(() => {
    const backAction = () => {
      Platform.OS === 'android' ? BackHandler.exitApp() : false;
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return <ScreenBase desc="e" onOptions={() => {}} />;
};

export default HomeScreen;

const styles = StyleSheet.create({});
