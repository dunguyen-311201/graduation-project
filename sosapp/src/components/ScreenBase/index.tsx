import {
  StyleSheet,
  View,
  Platform,
  ViewStyle,
  KeyboardAvoidingView,
  StyleProp,
} from 'react-native';
import React, {memo} from 'react';

import {CustomButton, CustomText} from '../common';
import {BACKGROUND_COLOR, WHITE_COLOR} from '@theme';

type ScreenBaseProps = {
  title?: string;
  desc?: string;
  children?: React.ReactNode;
  onNext?: () => void;
  customStyle?: StyleProp<ViewStyle>;
  padding?: number;
};

const ScreenBase = ({
  title,
  children,
  desc,
  onNext,
  customStyle,
  padding,
}: ScreenBaseProps) => {
  return (
    <View style={[styles.container, {paddingHorizontal: padding || 32}]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.keyboard, customStyle]}>
        {title && (
          <CustomText
            text={title}
            customStyle={styles.header}
            type="text_medium_30"
          />
        )}
        {desc && (
          <CustomText
            text={desc}
            customStyle={styles.header}
            type="text_medium_24"
          />
        )}

        {children}
      </KeyboardAvoidingView>
      {onNext && <CustomButton onPress={onNext} label="Next" />}
    </View>
  );
};

export default memo(ScreenBase);

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: 62,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
    marginTop: 15,
  },
  message: {
    backgroundColor: WHITE_COLOR,
    width: '80%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'center',
    marginTop: 5,
    borderRadius: 10,
  },
});
