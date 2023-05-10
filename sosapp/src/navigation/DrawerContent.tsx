import React, {
  useCallback,
  useMemo,
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Image, StyleSheet, View, Pressable} from 'react-native';

import {ProfileIcon, ResetIcon} from '@theme';
import {CustomButton, CustomText} from '@components';
import {useAuth} from '@hooks';
import {EScreen} from '@enums';
import {getAsyncStorage, handleLogout} from '@utils';
import {Location} from '@types';
import {CURRENT_LOCATION} from '@constants/cache';
import {Context} from '@context';

const DrawerContent = (props: DrawerContentComponentProps) => {
  const {currentUser} = useAuth();

  const {resetLocation, isReload} = useContext(Context);

  const [location, setLocation] = useState<Location>();

  const [icon, displayName] = useMemo(() => {
    let _icon = ProfileIcon,
      _displayName = 'User';

    if (currentUser && currentUser !== null) {
      if (currentUser.photoURL !== null) {
        _icon = {uri: currentUser.photoURL};
      }
      if (currentUser.displayName !== null) {
        _displayName = currentUser?.displayName;
      }
    }
    return [_icon, _displayName];
  }, [currentUser]);

  useEffect(() => {
    const setup = async () => {
      const lo = await getAsyncStorage<Location>(CURRENT_LOCATION);
      if (lo !== null) {
        setLocation(lo);
      }
    };

    setup();
  }, []);

  const _handleSignout = useCallback(async () => {
    await handleLogout();
    props.navigation.reset({index: 0, routes: [{name: EScreen.SPLASH}]});
    props.navigation.navigate(EScreen.SIGNUP_BY_PHONE_NUMBER);
  }, [props.navigation]);

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}>
        <View style={styles.profile}>
          <View style={styles.info}>
            <Image source={icon} style={styles.avatar} />
            <CustomText
              text={displayName}
              customStyle={styles.name}
              type="text_medium_18"
            />
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.bottom}>
        <View style={styles.location}>
          <View style={styles.row}>
            <CustomText
              text="Device Location: "
              color="black"
              type="text_medium_14"
            />
            <CustomText
              text={location?.description?.district || ''}
              color="blue"
              type="text_medium_14"
            />
          </View>
          <Pressable onPress={resetLocation} disabled={isReload}>
            <Image source={ResetIcon} style={styles.iconReset} />
          </Pressable>
        </View>
        <CustomButton label="Sign out" onPress={_handleSignout} />
      </View>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerContent: {
    backgroundColor: '#fff',
  },
  profile: {
    paddingVertical: 20,
    marginLeft: 20,
  },
  info: {
    alignSelf: 'flex-start',
    alignItems: 'center',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    marginTop: 10,
  },
  bottom: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  location: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  iconReset: {
    width: 30,
    height: 30,
  },
});
