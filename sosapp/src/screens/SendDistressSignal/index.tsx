import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useDeviceLocation} from '../../hooks';
import {firebase} from '@react-native-firebase/database';
import {Button} from 'react-native';

const SendDistreeSignal = () => {
  const {deviceLocation} = useDeviceLocation();

  useEffect(() => {
    const ref = firebase
      .app()
      .database('https://graduation-project-c9688-default-rtdb.firebaseio.com')
      .ref('/signals');

    ref.on('value', snapshot => {
      console.log(snapshot.val());
    });
    return () => {
      ref.off('value');
    };
  }, []);

  const sendSignal = useCallback(async () => {
    firebase
      .app()
      .database('https://graduation-project-c9688-default-rtdb.firebaseio.com')
      .ref('/signals')
      .push({deviceLocation});
  }, [deviceLocation]);

  return (
    <View>
      <Text>SEND_DISTRESS_SIGNAL</Text>
      <Button title="Send Location" onPress={sendSignal} />
    </View>
  );
};

export default SendDistreeSignal;

const styles = StyleSheet.create({});
