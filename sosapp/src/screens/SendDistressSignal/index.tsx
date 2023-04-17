import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useLocation} from '../../hooks';
import {firebase} from '@react-native-firebase/database';
import {Button} from 'react-native';

const SendDistreeSignal = () => {
  const {location} = useLocation(state => state);

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
      .push({location});
  }, [location]);

  return (
    <View>
      <Text>SEND_DISTRESS_SIGNAL</Text>
      <Button title="Send Location" onPress={sendSignal} />
    </View>
  );
};

export default SendDistreeSignal;

const styles = StyleSheet.create({});
