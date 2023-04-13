import React, {useCallback} from 'react';
import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {StyleSheet} from 'react-native';
import {SettingsScreen, MessagesScreen} from '@screens';

import DrawerContent from './DrawerContent';
import {EScreen} from '@enums';
import StackNavigation from './StackNavigation';

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
