import {StyleSheet, View, Switch} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {EScreen} from '@enums';
import {RootScreenNavigationProps} from '@navigation';
import {CustomInput, CustomText, ScreenBase} from '@components';
import {getAsyncStorage, setAsyncStorage, Styles as st} from '@utils';
import {EUser} from '@enums';
import {USER_CACHE} from '@constants';
import {TextInput} from 'react-native-gesture-handler';
import {TUser} from '@types';

const SetupInfoScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_INFO>>();

  const [focusable, setFocusable] = useState(false);

  const inputFirstRef = useRef<TextInput>(null);
  const inputLastRef = useRef<TextInput>(null);

  const [data, setData] = useState<TUser>();

  const {firstName, lastName} = data || {};

  useEffect(() => {
    setOptions({headerShown: false});
    if (inputFirstRef?.current) {
      inputFirstRef?.current?.focus();
    }
  }, [setOptions]);

  const handleNext = useCallback(async () => {
    if (firstName && lastName) {
      const caseUser = await getAsyncStorage<TUser>(USER_CACHE);
      let _location;
      if (caseUser !== null) {
        _location = caseUser.location;
      }
      await setAsyncStorage<TUser>(USER_CACHE, {
        firstName,
        lastName,
        location: _location,
      });
      navigate(EScreen.CONFIRM_POLICY);
    }
  }, [firstName, lastName, navigate]);

  const handleChangeText = useCallback((value: string, field?: string) => {
    if (field) {
      setData(prev => ({...prev, [field]: value}));
    }
  }, []);

  const handleEndEditing = useCallback(
    (field: string) => {
      if (field === EUser.first) {
        inputLastRef?.current?.focus();
        return;
      }
      handleNext();
    },
    [handleNext],
  );

  return (
    <ScreenBase desc="What's your name?" onNext={handleNext}>
      <View style={styles.group}>
        <CustomInput
          field={EUser.first}
          nColumn={2}
          value={firstName}
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
          value={lastName}
          titleStyle={st.text_medium_24}
          valueStyle={st.text_medium_gray_24}
          onChangeText={handleChangeText}
          title="Last"
          ref={inputLastRef}
          onEndEditing={handleEndEditing}
        />
      </View>
      <View style={styles.group}>
        <CustomText
          text="You want to turn on join the rescue"
          type="text_medium_18"
          color="blue"
        />
        <Switch
          value={focusable}
          onValueChange={() => setFocusable(prev => !prev)}
        />
      </View>
    </ScreenBase>
  );
};

export default SetupInfoScreen;

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
