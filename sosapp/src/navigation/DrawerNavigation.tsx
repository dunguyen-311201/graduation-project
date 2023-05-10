import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import React, {useCallback, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import {EScreen} from '@enums';
import {PermissionsAndroid, StyleSheet} from 'react-native';
import DrawerContent from './DrawerContent';
import {subcribeNotifyAppOpen} from '@utils';
import {BACKGROUND_COLOR, DARK_GRAY_COLOR, WHITE_COLOR} from '@theme';
import {SettingsScreen, MessagesScreen, HomeScreen} from '@screens';
import {RootScreenNavigationProps} from '.';
import {CustomModal} from '@components';
import {useMessage} from '@hooks';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

export type DrawerParamList = {
  [EScreen.SETTINGS]: undefined;
  [EScreen.MESSAGES]: undefined;
  [EScreen.HOME]: undefined;
  [EScreen.HELP]: undefined;
};

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.SEND_DISTRESS_SIGNAL>>();

  const [uid, setUid] = useState<string>();
  const {message} = useMessage(uid);

  useEffect(() => {
    const handlePushNotification = async (_uid: string) => {
      setUid(_uid);
    };

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data) {
          navigate(EScreen.DETAIL_MESSAGE, {uid: remoteMessage.data.id});
        }
      });

    return subcribeNotifyAppOpen(handlePushNotification);
  }, [navigate]);

  const renderContent = useCallback(
    (props: DrawerContentComponentProps) => <DrawerContent {...props} />,
    [],
  );

  const handleClose = useCallback(() => {
    setUid(undefined);
  }, []);

  const handleNotify = useCallback(() => {
    if (uid) {
      navigate(EScreen.DETAIL_MESSAGE, {uid});
      setUid(undefined);
    }
  }, [navigate, uid]);

  return (
    <>
      {message && (
        <CustomModal
          title={message.type}
          description={message.description}
          isVisible={true}
          onClose={handleClose}
          onOk={handleNotify}
        />
      )}
      <Drawer.Navigator
        drawerContent={renderContent}
        screenOptions={{
          headerTitleStyle: {
            color: WHITE_COLOR,
            fontWeight: '500',
            fontSize: 22,
          },
          headerTintColor: DARK_GRAY_COLOR,
          title: '',
          headerStyle: {
            backgroundColor: BACKGROUND_COLOR,
          },
        }}>
        <Drawer.Screen
          name={EScreen.HOME}
          options={{
            title: EScreen.HOME.split('-')[0],
            drawerLabelStyle: {...styles.title},
          }}
          component={HomeScreen}
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
        <Drawer.Screen
          name={EScreen.HELP}
          options={{
            title: EScreen.HELP.split('-')[0],
            drawerLabelStyle: {...styles.title},
          }}
          component={MessagesScreen}
        />
      </Drawer.Navigator>
    </>
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
