/**
 * @format
 */

import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';

import App from './src/App';
import {AppRegistry} from 'react-native';
import Config from 'react-native-config';
import {name as appName} from './app.json';

if (Config.ENV === 'dev') {
  // firebase.database().useEmulator('localhost', 9000);
  // firebase.auth().useEmulator('http://localhost:9099');
  // firebase.firestore().useEmulator('localhost', 8080);
}
navigator.geolocation = require('@react-native-community/geolocation');

AppRegistry.registerComponent(appName, () => App);
