import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation/RootNavigation';
import {getAsyncStorage} from '@utils/asyncStorage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Geolocation from '@react-native-community/geolocation';

import {EScreen} from '@enums';

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

  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
