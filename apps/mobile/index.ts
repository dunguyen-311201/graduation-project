import 'react-native-gesture-handler';

import {registerRootComponent} from 'expo';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

import App from './src/App';

// FCM shows notification messages itself while the app is in the background;
// the handler must still be registered outside React, before the app mounts.
setBackgroundMessageHandler(getMessaging(), async () => {});

registerRootComponent(App);
