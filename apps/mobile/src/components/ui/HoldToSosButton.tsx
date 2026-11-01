import {Animated, Easing, Pressable, StyleSheet, Vibration, View} from 'react-native';
import React, {memo, useCallback, useEffect, useRef} from 'react';

import {colors, space} from '../../theme/tokens';
import Txt from './Txt';

type HoldToSosButtonProps = {
  onTrigger: () => void;
  holdMs?: number;
  size?: number;
  disabled?: boolean;
};

// Press and hold to send: stops pocket taps without a confirm dialog.
const HoldToSosButton = ({
  onTrigger,
  holdMs = 1500,
  size = 180,
  disabled,
}: HoldToSosButtonProps) => {
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
      timer.current && clearTimeout(timer.current);
    };
  }, [pulse]);

  const handlePressIn = useCallback(() => {
    Vibration.vibrate(20);
    Animated.timing(progress, {
      toValue: 1,
      duration: holdMs,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
    timer.current = setTimeout(() => {
      timer.current = null;
      Vibration.vibrate([0, 60, 60, 60]);
      progress.setValue(0);
      onTrigger();
    }, holdMs);
  }, [holdMs, onTrigger, progress]);

  const handlePressOut = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const ring = size + 48;

  return (
    <View style={[styles.wrap, {width: ring, height: ring}]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          {
            width: ring,
            height: ring,
            borderRadius: ring / 2,
            opacity: pulse.interpolate({inputRange: [0, 1], outputRange: [0.8, 0]}),
            transform: [
              {scale: pulse.interpolate({inputRange: [0, 1], outputRange: [0.8, 1.1]})},
            ],
          },
        ]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="SOS. Press and hold to request rescue"
        accessibilityState={{disabled: Boolean(disabled)}}
        accessibilityActions={[{name: 'activate'}]}
        onAccessibilityAction={onTrigger}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          {width: size, height: size, borderRadius: size / 2},
          disabled && styles.disabled,
        ]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.fill,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [{scale: progress}],
            },
          ]}
        />
        <Txt variant="title" color={colors.onPrimary} style={styles.sos}>
          SOS
        </Txt>
        <Txt variant="caption" color={colors.onPrimary}>
          Hold to send
        </Txt>
      </Pressable>
    </View>
  );
};

export default memo(HoldToSosButton);

const styles = StyleSheet.create({
  wrap: {alignItems: 'center', justifyContent: 'center', alignSelf: 'center'},
  glow: {position: 'absolute', backgroundColor: colors.sosGlow},
  button: {
    backgroundColor: colors.sos,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 8,
  },
  fill: {position: 'absolute', backgroundColor: colors.sosPressed},
  sos: {fontSize: 44, lineHeight: 50, letterSpacing: 2, marginBottom: space.xs},
  disabled: {opacity: 0.5},
});
