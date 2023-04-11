import React, {useCallback, useContext, useMemo} from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Image, StyleSheet, View} from 'react-native';
import {ProfileIcon} from '@theme';
import {CustomButton, CustomText} from '@components/common';
import {StackScreenNavigationProps} from '.';
import {EScreen} from '@enums/EScreen';
import {useNavigation} from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import {Context} from '@context';

const DrawerContent = (props: DrawerContentComponentProps) => {
  const {navigate} = useNavigation<StackScreenNavigationProps<EScreen.HOME>>();

  const {userProfile} = useContext(Context);

  const Icon = useMemo(() => {
    if (userProfile.user === null) {
      return ProfileIcon;
    }
    return userProfile.user.photoURL;
  }, [userProfile]);

  const _handleSignout = useCallback(async () => {
    await auth().signOut();
    navigate(EScreen.SPLASH);
  }, [navigate]);

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}>
        <View style={styles.profile}>
          <View style={styles.info}>
            <Image source={Icon} style={styles.avatar} />
            <CustomText
              text={`${userProfile?.firstName || ''} ${
                userProfile?.lastName || ''
              }`}
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
    marginHorizontal: 20,
    marginBottom: 20,
  },
});
