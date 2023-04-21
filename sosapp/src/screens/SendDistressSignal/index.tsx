import {StyleSheet, Button} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useDeviceLocation} from '../../hooks';
import {useNavigation} from '@react-navigation/native';

import {RootScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums/EScreen';
import {ScreenBase} from '@components';
import {callAPI} from '@services';

const SendDistreeSignal = () => {
  const {setOptions, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.MAP>>();

  const {deviceLocation} = useDeviceLocation();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const sendSignal = useCallback(async () => {
    await callAPI({
      route: 'MESSAGE',
      method: 'POST',
      data: {
        location: deviceLocation,
        type: 'Car has a problem',
        describe: 'The car has a tire problem, I need a rescue team right now',
        user: 'vMl4u3W1RbgzW5pPxqpF',
      },
    });
  }, [deviceLocation]);

  return (
    <ScreenBase
      onBack={goBack}
      title="You have to connect to the support service">
      <Button title="Send Location" onPress={sendSignal} />
    </ScreenBase>
  );
};

export default SendDistreeSignal;

const styles = StyleSheet.create({});
