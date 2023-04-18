import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import ScreenBase from '@components/ScreenBase';
import {EScreen} from '@enums/EScreen';
import {RootScreenNavigationProps} from '@navigation';
import {CustomInput} from '@components';
import {Styles as st} from '@utils';
import {TUser} from '@types';
import {EUser} from '@enums/EUser';
import {useAuth} from '@hooks';
import {TextInput} from 'react-native-gesture-handler';

const SetupNameScreen = () => {
  const [user, setUser] = useState<TUser>();

  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_NAME>>();

  const {updateDisplayName} = useAuth();

  const inputFirstRef = useRef<TextInput>(null);
  const inputLastRef = useRef<TextInput>(null);

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  useEffect(() => {
    if (inputFirstRef?.current) {
      inputFirstRef?.current?.focus();
    }
  }, []);

  const handleNext = useCallback(async () => {
    await updateDisplayName(`${user?.firstName} ${user?.lastName}`);
    navigate(EScreen.CONFIRM_POLICY);
  }, [navigate, updateDisplayName, user?.firstName, user?.lastName]);

  const handleChangeText = useCallback((value: string, field?: string) => {
    if (field) {
      setUser(prev => ({...prev, [field]: value}));
    }
  }, []);

  const handleEndEditing = useCallback(
    (field: string) => {
      switch (field) {
        case EUser.first:
          inputLastRef?.current?.focus();
          break;

        case EUser.last:
          handleNext();
          break;

        default:
          break;
      }
    },
    [handleNext],
  );

  return (
    <ScreenBase desc="What's your name?" onBack={goBack} onNext={handleNext}>
      <View style={styles.group}>
        <CustomInput
          field={EUser.first}
          nColumn={2}
          value={user?.firstName}
          titleStyle={st.text_medium_24}
          valueStyle={st.text_medium_gray_24}
          onChangeText={handleChangeText}
          title="Firt"
          ref={inputFirstRef}
          onEndEditing={handleEndEditing}
        />
        <CustomInput
          field={EUser.last}
          nColumn={2}
          value={user?.lastName}
          titleStyle={st.text_medium_24}
          valueStyle={st.text_medium_gray_24}
          onChangeText={handleChangeText}
          title="Last"
          ref={inputLastRef}
          onEndEditing={handleEndEditing}
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
});
