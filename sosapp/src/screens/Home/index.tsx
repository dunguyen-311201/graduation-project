import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '@navigation/RootNavigation';
import {getAsyncStorage} from '@utils/asyncStorage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

const HomeScreen = () => {
  const {setOptions} = useNavigation<RootScreenNavigationProps<'Home'>>();

  async function getUser() {
    const user = await getAsyncStorage<FirebaseAuthTypes.UserCredential>(
      'user',
    );
    const user1 = auth().currentUser;
    console.log(user, user1);
  }
  useEffect(() => {
    setOptions({headerShown: false});
    getUser();
  }, [setOptions]);

  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
