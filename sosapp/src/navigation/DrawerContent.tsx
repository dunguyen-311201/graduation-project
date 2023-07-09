import {BACKGROUND_COLOR, BLACK_COLOR, ProfileIcon, WHITE_COLOR} from '@theme';
import {CustomButton, CustomText, Loading} from '@components';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Image, StyleSheet, View} from 'react-native';
import React, {useContext, useState, useCallback} from 'react';

import {Context} from '@context';
import {EScreen} from '@enums';

const DrawerContent = (props: DrawerContentComponentProps) => {
  const {currentUser, signOut} = useContext(Context);
  const [loading, setLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    if (currentUser) {
      setLoading(true);
      await signOut();
      setLoading(false);
    }
  }, [currentUser, signOut]);

  const handleGoMessage = async () => {
    props.navigation.navigate(EScreen.MESSAGES);
  };

  return (
    <>
      {loading && <Loading />}
      <View style={styles.container}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.drawerContent}>
          <View style={styles.profile}>
            <View style={styles.content}>
              <View style={styles.avatar}>
                <Image
                  source={
                    currentUser?.photoURL
                      ? {uri: currentUser.photoURL}
                      : ProfileIcon
                  }
                  style={styles.img}
                />
              </View>
              <CustomText
                text={currentUser?.displayName || 'User'}
                customStyle={styles.name}
                type="text_large_20"
                color="white"
              />
            </View>
            <CustomButton
              label="Notifications"
              type="secondary"
              customStyle={styles.buttonMessage}
              onPress={handleGoMessage}
            />
          </View>
          <View style={styles.list}>
            <DrawerItemList {...props} />
          </View>
        </DrawerContentScrollView>
        <View style={styles.bottom}>
          <CustomButton label="Sign out" onPress={handleLogout} />
        </View>
      </View>
    </>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  drawerContent: {
    backgroundColor: BACKGROUND_COLOR,
  },
  profile: {
    paddingVertical: 20,
    backgroundColor: BLACK_COLOR,
    paddingHorizontal: 40,
  },
  content: {
    flexDirection: 'row',
    borderBottomColor: WHITE_COLOR,
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingBottom: 20,
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 48,
    height: 46,
  },
  name: {
    marginLeft: 20,
  },
  list: {paddingLeft: 20, paddingTop: 20},
  bottom: {
    marginHorizontal: 40,
    marginBottom: 20,
  },
  buttonMessage: {
    marginTop: 33,
  },
});
