import auth from '@react-native-firebase/auth';
import React, {useCallback, useContext, useRef, useState} from 'react';
import {Context} from '@context';
import {CustomInput, ScreenBase} from '@components';
import {EScreen} from '@enums';
import {Field, validate} from '@utils';
import {RootScreenNavigationProps} from '@navigation';
import {StyleSheet, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

type FormData = {
  email?: string;
  password?: string;
};

const SignInByEmail = () => {
  const {goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.SIGNIN_BY_EMAIL>>();

  const [loading, setLoading] = useState(false);

  const {signIn} = useContext(Context);

  const ref = useRef<TextInput>();

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
              message: 'This field is Email!',
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
            let next;
            if (prev) {
              for (const key in prev) {
                if (key !== field) {
                  if (!next) {
                    next = {};
                  }
                  next[key] = prev[key];
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
        const userCredential = await auth().signInWithEmailAndPassword(
          email,
          password,
        );
        const uid = userCredential.user.uid;
        await signIn(uid);
      }
    } catch (err) {
      setError({
        email: 'Please check your email!',
        password: 'Please check your password!',
      });
    }
    setLoading(false);
  }, [data]);

  return (
    <ScreenBase
      loading={loading}
      title="You are the rescue team?"
      onNext={handleLoginByEmailPassword}
      onBack={goBack}
      disableNext={error !== undefined}>
      <View style={styles.content}>
        <CustomInput
          value={data?.email}
          field="email"
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

const styles = StyleSheet.create({
  content: {
    rowGap: 20,
  },
});
