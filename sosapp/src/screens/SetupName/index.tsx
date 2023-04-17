import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import ScreenBase from '@components/ScreenBase';
import {EScreen} from '@enums/EScreen';
import {RootScreenNavigationProps} from '@navigation';
import {CustomInput} from '@components';
import {Styles as st} from '@utils';
import {TUser} from '@types';
import {EUser} from '@enums/EUser';
import {useAuth} from '@hooks';

const SetupNameScreen = () => {
  const [user, setUser] = useState<TUser>();

  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_NAME>>();

  const {updateDisplayName} = useAuth();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const handleNext = useCallback(async () => {
    await updateDisplayName(`${user?.firstName} ${user?.lastName}`);
    navigate(EScreen.CONFIRM_POLICY);
  }, [navigate, updateDisplayName, user?.firstName, user?.lastName]);

  const handleChangeText = useCallback((value: string, field?: string) => {
    if (field) {
      setUser(prev => ({...prev, [field]: value}));
    }
  }, []);

  return (
    <ScreenBase desc="What's your name?" onBack={goBack} onNext={handleNext}>
      <View style={styles.group}>
        <CustomInput
          field={EUser.first}
          value={user?.firstName}
          titleStyle={st.text_medium_24}
          valueStyle={st.text_medium_gray_24}
          onChangeText={handleChangeText}
          title="Firt"
        />
        <View style={styles.separator} />
        <CustomInput
          field={EUser.last}
          value={user?.lastName}
          titleStyle={st.text_medium_24}
          valueStyle={st.text_medium_gray_24}
          onChangeText={handleChangeText}
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
