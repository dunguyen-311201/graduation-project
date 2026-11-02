import {signInWithEmailAndPassword} from '@react-native-firebase/auth';
import {auth} from '@services';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, TextInput, View} from 'react-native';
import type {TextInputInstance} from 'react-native';
import React, {useCallback, useContext, useRef, useState} from 'react';

import {Context} from '@context';
import {EScreen} from '@enums';
import {Field, validate} from '@utils';
import {CustomInput, ScreenBase} from '@components';
import {RootScreenNavigationProps} from '@navigation';
import {themedStyles} from '../../theme/tokens';

type FormData = {
  email?: string;
  password?: string;
};

const SignInByEmail = () => {
  const {goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNIN_BY_EMAIL>>();

  const [loading, setLoading] = useState(false);

  const {signIn} = useContext(Context);

  const ref = useRef<TextInputInstance>(null);

  const [data, setData] = useState<FormData>();

  const [error, setError] = useState<FormData>();

  const handleChangeText = useCallback((value: string, field: string) => {
    setData(prev => ({...prev, [field]: value}));
  }, []);

  const handleEndEdit = useCallback(
    (field: string) => {
      if (field === 'email' && ref.current && !error) {
        ref.current.focus();
      }
    },
    [error],
  );

  const handleFocus = useCallback((field: string) => {
    setError(prev => ({...prev, [field]: undefined}));
  }, []);

  const handleValid = useCallback(
    (field?: string) => {
      const fields: Field[] = [
        {
          field: 'email',
          rules: [
            {
              check: validate.isRequired(data?.email),
              message: 'This field is required!',
            },
            {
              check: !validate.isEmail(data?.email),
              message: 'Please enter a valid email address.',
            },
          ],
        },
        {
          field: 'password',
          rules: [
            {
              check: validate.isRequired(data?.password),
              message: 'This field is required!',
            },
          ],
        },
      ];

      let err: any;

      if (field) {
        const rule = fields.find(f => f.field === field);
        if (rule) {
          err = validate([rule]);

          setError(prev => {
            let next: FormData | undefined;
            if (prev) {
              for (const key in prev) {
                if (key !== field) {
                  if (!next) {
                    next = {};
                  }
                  next[key as keyof FormData] = prev[key as keyof FormData];
                }
              }
              if (next || err) {
                return {...next, ...err};
              }
            }
            return err;
          });
        }
      } else {
        err = validate(fields);
        setError(err);
        return err;
      }
    },
    [data],
  );

  const handleLoginByEmailPassword = useCallback(async () => {
    if (handleValid()) {
      return;
    }
    setLoading(true);
    try {
      const {email, password} = data || {};
      if (email && password) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const uid = userCredential.user.uid;
        if (!(await signIn(uid))) {
          setError({password: 'This account has no SOS profile yet.'});
        }
      }
    } catch (err) {
      setError({password: 'Incorrect email or password. Please try again.'});
    }
    setLoading(false);
  }, [data]);

  return (
    <ScreenBase
      loading={loading}
      title="You are the rescue team?"
      onNext={handleLoginByEmailPassword}
      onBack={goBack}
      disableNext={Boolean(error?.email || error?.password)}>
      <View style={styles.content}>
        <CustomInput
          value={data?.email}
          field="email"
          maxLength={100}
          onChangeText={handleChangeText}
          onEndEditing={handleEndEdit}
          onBlur={handleValid}
          errorMessage={error?.email}
          onFocus={handleFocus}
          title="Email"
          inputMode="email"
          border
        />
        <CustomInput
          ref={ref}
          inputMode="password"
          onBlur={handleValid}
          errorMessage={error?.password}
          onChangeText={handleChangeText}
          value={data?.password}
          field="password"
          title="Password"
          onFocus={handleFocus}
          border
        />
      </View>
    </ScreenBase>
  );
};

export default SignInByEmail;

const styles = themedStyles(() => StyleSheet.create({
  content: {
    rowGap: 20,
  },
}));
