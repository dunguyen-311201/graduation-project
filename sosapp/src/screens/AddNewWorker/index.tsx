import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';

import {EScreen} from '@enums';
import {Context} from '@context';
import {callAPI} from '@services';
import {DARK_GRAY_COLOR} from '@theme';
import {Field, validate} from '@utils';
import {CustomInput, ScreenBase} from '@components';
import {RootScreenNavigationProps} from '@navigation';

type TWorker = {
  id?: string;
  centerID?: string;
  email?: string;
  password?: string;
  displayName?: string;
  ['rePassword']?: string;
};

const AddNewWorker = () => {
  const {setOptions, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.WORKER>>();

  const [worker, setWorker] = useState<TWorker>();
  const [error, setError] = useState<TWorker>();
  const [isVisible, setVisible] = useState(0);
  const [loading, setLoading] = useState(false);

  const {currentUser} = useContext(Context);

  useEffect(() => {
    if (currentUser?.displayName) {
      const displayName = 'worker' + Math.round(Math.random() * 10 ** 4);
      const email =
        displayName +
        '@' +
        currentUser.displayName.split(' ').join('').toLowerCase() +
        '.com';

      setWorker({
        email,
        centerID: currentUser.id,
        displayName,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    setOptions({headerShown: true});
  }, []);

  const handleAddWorker = useCallback(async () => {
    try {
      setLoading(true);

      const {rePassword, ...data} = worker || {};

      rePassword &&
        (await callAPI({
          method: 'POST',
          route: 'users/new-worker',
          data,
        }));

      goBack();
    } catch (err: any) {
      setError(err);
    }

    setLoading(false);
  }, [worker]);

  const handleBlur = useCallback(
    (field: string) => {
      const fields: Field[] = [
        {
          field: 'password',
          rules: [
            {
              check: validate.isRequired(worker?.password),
              message: 'This field is required!',
            },
            {
              check: validate.minLength(6, worker?.password),
              message: 'Minimum length is 6 characters!',
            },
          ],
        },
        {
          field: 're-password',
          rules: [
            {
              check: validate.isRequired(worker?.rePassword),
              message: 'This field is required!',
            },
            {
              check: validate.isSample(worker?.rePassword, worker?.password),
              message: 'Comfirm Password incorrect!',
            },
          ],
        },
      ];

      const err = validate(
        field ? fields.filter(item => item.field === field) : fields,
      );

      setError(prev => {
        const next = {...prev, ...err};
        if (Object.values(next).every(item => item === undefined)) {
          return undefined;
        }
        return next;
      });
    },
    [worker],
  );

  const handleFocus = useCallback((field: string) => {
    setError(prev => ({...prev, [field]: undefined}));
    setVisible(prev => prev + 1);
  }, []);

  const handleChangeText = useCallback((value: string, field: string) => {
    setWorker(prev => ({...prev, [field]: value}));
  }, []);

  return (
    <ScreenBase
      loading={loading}
      title="Add New Worker"
      onNext={handleAddWorker}
      nextTitle="Add"
      disableNext={isVisible < 2 || error !== undefined}>
      <View style={styles.content}>
        <CustomInput
          field=""
          title="Email"
          value={worker?.email}
          border
          valueStyle={styles.input}
          editable={false}
          onChangeText={handleChangeText}
        />
        <CustomInput
          field="password"
          title="Password"
          value={worker?.password}
          valueStyle={styles.input}
          border
          onChangeText={handleChangeText}
          inputMode="password"
          onBlur={handleBlur}
          errorMessage={error?.password}
          onFocus={handleFocus}
        />

        <CustomInput
          title="Re-Password"
          field="rePassword"
          value={worker?.rePassword}
          valueStyle={styles.input}
          onChangeText={handleChangeText}
          inputMode="password"
          onBlur={handleBlur}
          errorMessage={error?.rePassword}
          onFocus={handleFocus}
          border
        />
      </View>
    </ScreenBase>
  );
};

export default AddNewWorker;

const styles = StyleSheet.create({
  btnAdd: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  content: {
    rowGap: 20,
    marginTop: 20,
  },
  input: {
    color: DARK_GRAY_COLOR,
  },
});
