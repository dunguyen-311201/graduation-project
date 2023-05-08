/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
navigator.geolocation = require('@react-native-community/geolocation');

AppRegistry.registerComponent(appName, () => App);
