import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import ScreenBase from '@components/ScreenBase';
import {EScreen} from '@enums/EScreen';
import {StackScreenNavigationProps} from '@navigation';
import {CustomInput} from '@components';
import {Styles as st} from '@utils';

type Name = {
  first: string;
  last: string;
};
const SetupNameScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<StackScreenNavigationProps<EScreen.SIGNUP_NAME>>();

  const [user, setUser] = useState<Name>({first: '', last: ''});

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const {first, last} = user;

  const _onNext = useCallback(async () => {
    await auth().currentUser?.updateProfile({displayName: `${first} ${last}`});

    navigate(EScreen.CONFIRM_POLICY);
  }, [first, last, navigate]);

  const _onChangeText = useCallback((value: string, field: string) => {
    setUser(prev => ({...prev, [field]: value}));
  }, []);

  return (
    <ScreenBase desc="What's your name?" onBack={goBack} onNext={_onNext}>
      <View style={styles.group}>
        <CustomInput
          field="first"
          value={first}
          titleStyle={st.text_medium_24}
          valueStyle={st.text_medium_gray_24}
          onChangeText={_onChangeText}
          title="Firt"
        />
        <View style={styles.separator} />
        <CustomInput
          field="last"
          value={last}
          titleStyle={st.text_medium_24}
          valueStyle={st.text_medium_gray_24}
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

  separator: {
    width: 30,
  },
});
