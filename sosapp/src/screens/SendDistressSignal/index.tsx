import {StyleSheet, Button} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useDeviceLocation} from '../../hooks';
import {firebase} from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';

import {RootScreenNavigationProps} from '@navigation';
import {EScreen} from '@enums/EScreen';
import {ScreenBase} from '@components';

const SendDistreeSignal = () => {
  const {setOptions, goBack} =
    useNavigation<RootScreenNavigationProps<EScreen.MAP>>();

  const {deviceLocation} = useDeviceLocation();

  useEffect(() => {
    // const ref = firebase
    //   .app()
    //   .database('https://graduation-project-c9688-default-rtdb.firebaseio.com')
    //   .ref('/signals');
    // ref.on('value', snapshot => {
    //   console.log(snapshot.val());
    // });
    // return () => {
    //   ref.off('value');
    // };

    setOptions({headerShown: false});
  }, [setOptions]);

  const sendSignal = useCallback(async () => {
    firebase
      .app()
      .database('https://graduation-project-c9688-default-rtdb.firebaseio.com')
      .ref('/messages')
      .push({deviceLocation});
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
