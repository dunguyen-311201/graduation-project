import React, {useCallback, useEffect} from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Image, StyleSheet, View} from 'react-native';
import {useAuth} from '@hooks/useAuth';
import {ProfileIcon} from '@theme';
import {CustomButton, CustomText} from '@components/common';

const DrawerContent = (props: DrawerContentComponentProps) => {
  const {user, logout} = useAuth();

  let Icon = ProfileIcon;

  if (user !== null) {
    Icon = {uri: user.photoURL};
  }

  const _handleSignout = useCallback(() => {
    logout();
  }, [logout]);

  if (user === null) {
    return;
  }

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}>
        <View style={styles.profile}>
          <View style={styles.info}>
            <Image source={Icon} style={styles.avatar} />
            <CustomText
              {...(user.displayName !== null
                ? {text: user.displayName}
                : {text: ''})}
              customStyle={styles.name}
              type="text_medium_light_blue_18"
            />
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.bottom}>
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
    marginLeft: 20,
    marginBottom: 20,
  },
});
