import {StyleSheet, View, ViewStyle, StyleProp} from 'react-native';
import React, {memo} from 'react';

import {CustomButton, CustomText} from '../common';
import {BACKGROUND_COLOR, WHITE_COLOR} from '@theme';

type ScreenBaseProps = {
  title?: string;
  desc?: string;
  children?: React.ReactNode;
  onNext?: () => void;
  customStyle?: StyleProp<ViewStyle>;
};

const ScreenBase = ({
  title,
  children,
  desc,
  onNext,
  customStyle,
}: ScreenBaseProps) => {
  return (
    <View style={[styles.container, customStyle]}>
      <View>
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
      </View>
      <View>{onNext && <CustomButton onPress={onNext} label="Next" />}</View>
    </View>
  );
};

export default memo(ScreenBase);

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 62,
    // position: 'absolute'
    zIndex: 2,
    flex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
