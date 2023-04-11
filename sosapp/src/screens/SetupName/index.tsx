import {StyleSheet, View} from 'react-native';
import React, {useCallback, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import ScreenBase from '@components/ScreenBase';
import {EScreen} from '@enums/EScreen';
import {StackScreenNavigationProps} from '@navigation';
import {CustomInput} from '@components';
import {Styles as st} from '@utils';
import {Context} from '@context';

const SetupNameScreen = () => {
  const {userProfile, setUserProfile} = useContext(Context);

  const {setOptions, navigate, goBack} =
    useNavigation<StackScreenNavigationProps<EScreen.SIGNUP_NAME>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _onNext = useCallback(async () => {
    navigate(EScreen.CONFIRM_POLICY);
  }, [navigate]);

  const _onChangeText = useCallback(
    (value: string, field: string) => {
      setUserProfile({[field]: value, ...userProfile});
    },
    [setUserProfile, userProfile],
  );

  return (
    <ScreenBase desc="What's your name?" onBack={goBack} onNext={_onNext}>
      <View style={styles.group}>
        <CustomInput
          field="firstName"
          value={userProfile?.firstName}
          titleStyle={st.text_medium_24}
          valueStyle={st.text_medium_gray_24}
          onChangeText={_onChangeText}
          title="Firt"
        />
        <View style={styles.separator} />
        <CustomInput
          field="lastName"
          value={userProfile?.lastName}
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
