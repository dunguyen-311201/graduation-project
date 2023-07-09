import React, {memo, useCallback, useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Animated, Easing, StyleSheet} from 'react-native';

import {EScreen} from '@enums';
import NotifyCard from './NotifyCard';
import {useNotification} from '@hooks';
import {RootScreenNavigationProps} from '@navigation';

const Notification = () => {
  const hideAnim = useRef(new Animated.Value(0)).current;
  const {navigate} = useNavigation<RootScreenNavigationProps<EScreen.SPLASH>>();

  const {notify, hideNotify} = useNotification();

  useEffect(() => {
    if (notify) {
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
          hideNotify();
        });
      }, 4000);

      return () => {
        clearTimeout(timeId);
      };
    }
  }, [hideAnim, notify]);

  const handleAction = useCallback(() => {
    notify && navigate(EScreen.DETAIL_MESSAGE, notify);
  }, [notify]);

  console.log(46, notify);

  return (
    <>
      {notify && !notify.background && (
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
          <NotifyCard
            notify={notify}
            onClose={hideNotify}
            onPress={handleAction}
            onReject={notify.onReject}
          />
        </Animated.View>
      )}
    </>
  );
};

export default memo(Notification);

export {NotifyCard};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 2,
    opacity: 0,
  },
});
