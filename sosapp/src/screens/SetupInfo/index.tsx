import {StyleSheet, View, Switch} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {useNavigation} from '@react-navigation/native';

import ScreenBase from '@components/ScreenBase';
import {EScreen} from '@enums/EScreen';
import {RootScreenNavigationProps} from '@navigation';
import {CustomInput, CustomText} from '@components';
import {getAsyncStorage, setAsyncStorage, Styles as st} from '@utils';
import {EUser} from '@enums';
import {USER_CACHE} from '@constants';
import {TextInput} from 'react-native-gesture-handler';
import {TUser} from '@types';
import useAuth from '@hooks/useAuth';

const SetupInfoScreen = () => {
  const {setOptions, navigate, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_INFO>>();

  const [focusable, setFocusable] = useState(false);

  const inputFirstRef = useRef<TextInput>(null);
  const inputLastRef = useRef<TextInput>(null);

  const [data, setData] = useState<TUser>();

  const {currentUser} = useAuth();

  const {phoneNumber, uid} = currentUser || {};

  const {firstName, lastName} = data || {};

  useEffect(() => {
    setOptions({headerShown: false});
    if (inputFirstRef?.current) {
      inputFirstRef?.current?.focus();
    }
  }, [setOptions]);

  const handleNext = useCallback(async () => {
    let cacheUser = await getAsyncStorage<TUser>(USER_CACHE);

    if (uid && phoneNumber && phoneNumber !== null) {
      await setAsyncStorage<TUser>(USER_CACHE, {
        ...cacheUser,
        firstName,
        lastName,
        phoneNumber,
        uid,
      });
    }
    navigate(EScreen.CONFIRM_POLICY);
  }, [firstName, lastName, navigate, phoneNumber, uid]);

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
    <ScreenBase desc="What's your name?" onBack={goBack} onNext={handleNext}>
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
          type="text_medium_light_blue_18"
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
