import {
  View,
  Keyboard,
  Platform,
  StyleProp,
  ViewStyle,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {memo, useCallback} from 'react';
import Loading from '../Loading';
import BackButton from '../BackButton';
import {BACKGROUND_COLOR} from '@theme';
import {CustomButton, CustomText} from '../common';
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
  flexHeader?: 'row' | 'column';
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
  flexHeader = 'column',
  nextTitle = 'Next',
}: ScreenBaseProps) => {
  const handleTouchOutside = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.keyboard, {paddingHorizontal: padding || 32}]}>
      <TouchableWithoutFeedback onPress={handleTouchOutside}>
        <View
          style={[
            customStyle,
            styles.container,
            {...(onBack && {paddingTop: 20})},
          ]}>
          <Notification />

          <View
            style={{
              ...(onBack && styles.header),
              ...(flexHeader === 'row'
                ? {
                    flexDirection: 'row',
                    alignItems: 'center',
                  }
                : {...(onBack && {marginTop: 36, marginBottom: 31})}),
            }}>
            {onBack && <BackButton onPress={onBack} />}
            {title && (
              <CustomText
                text={title}
                type="text_medium_30"
                customStyle={{
                  ...(flexHeader === 'column' && styles.title),
                }}
              />
            )}

            {desc && <CustomText text={desc} type="text_medium_24" />}
          </View>
          {loading ? <Loading /> : children}
        </View>
      </TouchableWithoutFeedback>
      {onNext && (
        <CustomButton
          onPress={onNext}
          label={nextTitle}
          disabled={disableNext}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default memo(ScreenBase);

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingBottom: 62,
  },
  container: {
    flex: 1,
  },
  header: {
    columnGap: 20,
    // alignItems: 'center',
  },
  title: {
    marginTop: 35,
  },
});
