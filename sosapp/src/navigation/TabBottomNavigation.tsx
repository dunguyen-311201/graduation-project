import React from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  BellFillIcon,
  BellIcon,
  MessageFillIcon,
  MessageIcon,
  TEXT_COLOR,
} from '@theme';
import {PendingMessageScreen, MessagesScreen} from '../screens';

export type BottomParamList = {
  'pending-message-screen': {uid: string};
  'all-messages-screen': {uid: string};
};

const Tab = createBottomTabNavigator<BottomParamList>();

const TabBottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarLabel: '',
        tabBarStyle: {height: 60, backgroundColor: TEXT_COLOR},
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({focused}) => {
          switch (route.name) {
            case 'all-messages-screen':
              return <Image source={focused ? MessageFillIcon : MessageIcon} />;
            case 'pending-message-screen':
              return <Image source={focused ? BellFillIcon : BellIcon} />;
          }
        },
        unmountOnBlur: true,
      })}>
      <Tab.Screen
        name="pending-message-screen"
        component={PendingMessageScreen}
      />
      <Tab.Screen name="all-messages-screen" component={MessagesScreen} />
    </Tab.Navigator>
  );
};

export default TabBottomNavigation;
