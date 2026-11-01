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

import {BACKGROUND_COLOR, tokens} from '@theme';
import Txt from '../ui/Txt';
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
    <TouchableWithoutFeedback onPress={handleTouchOutside} accessible={false}>
      <View
        style={[
          styles.container,
          {paddingHorizontal: padding || 24},
          {
            ...(onBack && {paddingTop: 24}),

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
          {desc && (
            <Txt variant="body" color={tokens.colors.textMuted}>
              {desc}
            </Txt>
          )}
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboard}>
          <View
            style={[
              customStyle,
              styles.keyboard,
              {...(title && {paddingTop: 20})},
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
    paddingBottom: 24,
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
