import {Image, Modal, View, StyleSheet, Animated} from 'react-native';
import React, {memo} from 'react';
import {Easing} from 'react-native-reanimated';
import {LoadingIcon} from '@theme';

const Loading = () => {
  const rotation = new Animated.Value(0);

  Animated.loop(
    Animated.timing(rotation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }),
  ).start();

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal transparent={true} animationType="none" visible={true}>
      <View style={styles.container}>
        <Animated.View
          style={{
            transform: [{rotate: spin}],
          }}>
          <Image source={LoadingIcon} style={styles.loadingImage} />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default memo(Loading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingImage: {width: 150, height: 150},
});
