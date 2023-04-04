import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import ScreenBase from '@components/ScreenBase';
import {EScreen} from '@enums/EScreen';
import {RootScreenNavigationProps} from '@navigation/RootNavigation';
import {CustomInput} from '@components';

type Name = {
  first: string;
  last: string;
};
const SetupNameScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_NAME>>();

  const [user, setUser] = useState<Name>({first: '', last: ''});

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const {first, last} = user;

  const _onNext = useCallback(async () => {
    console.log(user);
    await auth().currentUser?.updateProfile({displayName: `${first} ${last}`});
    console.log(auth().currentUser);

    navigate(EScreen.CONFIRM_POLICY);
  }, [user, first, last, navigate]);

  const _onChangeText = useCallback((value: string, field: string) => {
    setUser(prev => ({...prev, [field]: value}));
  }, []);

  return (
    <ScreenBase desc="What's your name?" onBack={goBack} onNext={_onNext}>
      <View style={styles.group}>
        <CustomInput
          field="first"
          value={first}
          titleStyle={styles.titleInput}
          valueStyle={styles.textInput}
          onChangeText={_onChangeText}
          title="Firt"
        />
        <View style={styles.separator} />
        <CustomInput
          field="last"
          value={last}
          titleStyle={styles.titleInput}
          valueStyle={styles.textInput}
          onChangeText={_onChangeText}
          title="Last"
        />
      </View>
    </ScreenBase>
  );
};

export default SetupNameScreen;

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
  },
  separator: {
    width: 30,
  },
  textInput: {
    color: '#979797',
    fontWeight: '500',
    fontSize: 24,
  },
});
