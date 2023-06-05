import {useNavigation} from '@react-navigation/native';
import {StyleSheet, View, TextInput} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {EScreen, EUser} from '@enums';
import {signupInfo} from '@utils';
import {RootScreenNavigationProps} from '@navigation';
import {CustomInput, Loading, ScreenBase} from '@components';
import {Context} from '@context';

const SetupInfoScreen = () => {
  const {setOptions, navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNUP_INFO>>();

  const inputFirstRef = useRef<TextInput>(null);
  const inputLastRef = useRef<TextInput>(null);

  const {currentUser} = useContext(Context);

  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    setOptions({headerShown: true});

    if (inputFirstRef?.current) {
      inputFirstRef?.current?.focus();
    }
  }, [setOptions, currentUser]);

  const handleNext = useCallback(async () => {
    setLoading(true);
    if (currentUser) {
      try {
        if (firstName !== '' && lastName !== '') {
          await currentUser?.updateProfile({
            displayName: `${firstName} ${lastName}`,
          });

          await signupInfo({
            firstName,
            lastName,
            lastLogin: Date.now(),
            uid: currentUser.uid,
            phoneNumber: currentUser.phoneNumber || '',
          });
          navigate(EScreen.CONFIRM_POLICY);
        }
      } catch (error) {}
    }
    setLoading(false);
  }, [currentUser, firstName, lastName, navigate]);

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
    <>
      {loading && <Loading />}
      <ScreenBase desc="What's your name?" onNext={handleNext}>
        <View style={styles.group}>
          <CustomInput
            field={EUser.first}
            value={firstName}
            onChangeText={setFirstName}
            title="First"
            ref={inputFirstRef}
            customStyle={styles.input}
            onEndEditing={handleEndEditing}
          />
          <CustomInput
            field={EUser.last}
            value={lastName}
            onChangeText={setLastName}
            ref={inputLastRef}
            title="Last"
            onEndEditing={handleEndEditing}
            customStyle={styles.input}
          />
        </View>
      </ScreenBase>
    </>
  );
};

export default SetupInfoScreen;

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  input: {
    width: '45%',
  },
});
