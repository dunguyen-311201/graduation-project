import {CustomButton, CustomText} from '../common';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import React, {memo, useCallback} from 'react';

import {BACKGROUND_COLOR} from '@theme';
import BackButton from '../BackButton';
import Loading from '../Loading';
import Notification from '../Notification';

type ScreenBaseProps = {
  title?: string;
  desc?: string;
  children?: React.ReactNode;
  onNext?: () => void;
  customStyle?: StyleProp<ViewStyle>;
  padding?: number;
  disableNext?: boolean;
  nextTitle?: string;
  onBack?: () => void;
  flexDirection?: 'row' | 'column';
  loading?: boolean;
};

const ScreenBase = ({
  title,
  children,
  desc,
  onNext,
  onBack,
  padding,
  loading,
  customStyle,
  disableNext,
  flexDirection = 'column',
  nextTitle = 'Next',
}: ScreenBaseProps) => {
  const handleTouchOutside = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={handleTouchOutside}>
      <View
        style={[
          styles.container,
          {paddingHorizontal: padding || 32},
          {
            ...(onBack && {paddingTop: 36, paddingBottom: 31}),

            // ...(onBack && styles.header),
          },
        ]}>
        {loading && <Loading />}
        <Notification />
        <View style={styles.header}>
          <View style={[styles.nav, {flexDirection}]}>
            {onBack && <BackButton onPress={onBack} />}
            {title && (
              <CustomText
                text={title}
                type="text_medium_30"
                customStyle={{
                  ...(flexDirection === 'column' && styles.title),
                }}
              />
            )}
          </View>
          {desc && <CustomText text={desc} type="text_medium_24" />}
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboard}>
          <View
            style={[
              customStyle,
              styles.container,
              {...(onBack && {paddingTop: 20})},
            ]}>
            {children}
          </View>
        </KeyboardAvoidingView>
        {onNext && (
          <CustomButton
            onPress={onNext}
            label={nextTitle}
            disabled={disableNext}
            customStyle={styles.button}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(ScreenBase);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingBottom: 62,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    columnGap: 20,
  },
  nav: {
    flexDirection: 'row',
    columnGap: 36,
  },
  title: {
    marginTop: 35,
  },
  button: {},
});
