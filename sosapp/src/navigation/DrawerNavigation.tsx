import React, {useCallback, useEffect} from 'react';
import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import SettingsScreen from '../screens/Settings';
import MessagesScreen from '../screens/Messages';

import DrawerContent from './DrawerContent';
import StackNavigation from './StackNavigation';
import {EScreen} from '@enums/EScreen';
import {StyleSheet} from 'react-native';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const renderContent = useCallback(
    (props: DrawerContentComponentProps) => <DrawerContent {...props} />,
    [],
  );

  return (
    <Drawer.Navigator drawerContent={renderContent}>
      <Drawer.Screen
        name={EScreen.STACK}
        component={StackNavigation}
        options={{
          headerShown: false,
          drawerLabelStyle: {...styles.title},
        }}
      />
      <Drawer.Screen
        name={EScreen.SETTINGS}
        options={{
          title: EScreen.SETTINGS.split('-')[0],
          drawerLabelStyle: {...styles.title},
        }}
        component={SettingsScreen}
      />
      <Drawer.Screen
        name={EScreen.MESSAGES}
        options={{
          title: EScreen.MESSAGES.split('-')[0],
          drawerLabelStyle: {...styles.title},
        }}
        component={MessagesScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({
  title: {
    textTransform: 'capitalize',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
