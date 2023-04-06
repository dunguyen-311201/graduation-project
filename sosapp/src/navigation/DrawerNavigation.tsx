import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsScreen from '../screens/Settings';
import MessagesScreen from '../screens/Messages';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="setting" component={SettingsScreen} />
      <Drawer.Screen name="message" component={MessagesScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
