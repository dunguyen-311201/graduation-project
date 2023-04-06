import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useLocation} from '../../hooks';
import {firebase} from '@react-native-firebase/database';

const SendDistreeSignal = () => {
  const {location} = useLocation(state => state);

  useEffect(() => {
    async function sendSignal() {
      const a = firebase
        .app()
        .database(
          'https://graduation-project-sos-app-default-rtdb.firebaseio.com',
        )
        .ref('/signals')
        .push({location});
      console.log(a);
    }
    // sendSignal();
  }, [location]);
  return (
    <View>
      <Text>SEND_DISTRESS_SIGNAL</Text>
    </View>
  );
};

export default SendDistreeSignal;

const styles = StyleSheet.create({});
