import {StyleSheet, View, Animated, Easing} from 'react-native';
import React, {memo, useRef, useEffect} from 'react';

import {WHITE_COLOR} from '@theme';
import CustomButton from '../common/Button';
import CustomText from '../common/Text';
import CloseButton from '../CloseButton';
import {TMessage} from '@types';

type NotifyProps = {
  message?: TMessage;
  body: string;
  onOk: () => void;
  onQuit: () => void;
};

const Notify = ({message, onOk, onQuit, body}: NotifyProps) => {
  const hideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(hideAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.cubic,
    }).start();

    const timeId = setTimeout(() => {
      Animated.timing(hideAnim, {
        toValue: 0,
        useNativeDriver: true,
        duration: 500,
        easing: Easing.ease,
      }).start(() => {
        onQuit();
      });
    }, 4000);

    return () => {
      clearTimeout(timeId);
    };
  }, [hideAnim, message, onQuit]);

  return (
    <>
      {message && (
        <Animated.View
          style={[
            styles.container,
            {
              opacity: hideAnim,
              transform: [
                {
                  translateY: hideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 10],
                  }),
                },
              ],
            },
          ]}>
          <CloseButton top={10} right={10} onPress={onQuit} />

          <View>
            <CustomText text={message.type} type="text_large_20" color="blue" />
            <CustomText text={body} type="text_medium_14" color="black" />
          </View>
          <View style={styles.actions}>
            <CustomButton label="View" type="notify" onPress={onOk} />
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default memo(Notify);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: WHITE_COLOR,
    top: 0,
    left: 32,
    right: 32,
    zIndex: 2,
    opacity: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  message: {
    backgroundColor: WHITE_COLOR,
    paddingHorizontal: 25,
    paddingVertical: 8,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  actions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
