import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {GRAY_COLOR, LIGHT_BLUE_COLOR} from '@theme';
import React, {memo} from 'react';

import CustomText from '../Text';
import {EButton} from '@enums';
import Shadow from '../../Shadow';
import {Styles as st} from '@utils';

type ButtonProps = {
  label?: string;
  children?: React.ReactNode;
  type?: keyof typeof EButton;
  icon?: ImageSourcePropType;
  customStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
  paddingVertical?: number;
  paddingHorizontal?: number;
  onPress?: () => void;
  disabled?: boolean;
  iconSize?: {height: number; width: number};
  isLoading?: boolean;
  reverse?: boolean;
};

const CustomButton = ({
  label = '',
  type = 'default',
  icon,
  iconSize,
  customStyle,
  onPress,
  children,
  disabled,
  reverse,
  isLoading = false,
}: ButtonProps) => {
  if (type === 'primary') {
    return (
      <Shadow customStyle={styles.shadow} paddingVertical={16}>
        <TouchableOpacity
          onPress={onPress}
          style={[styles[EButton[type]], customStyle]}>
          <CustomText text={label} type="text_xLarge" />
          {icon && <Image source={icon} style={[iconSize]} />}
        </TouchableOpacity>
      </Shadow>
    );
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        customStyle,
        styles[EButton[type]],
        {...(disabled && {opacity: 0.5})},
        {...(reverse && {flexDirection: 'row-reverse', columnGap: 20})},
      ]}>
      {children}
      {label && (
        <CustomText
          text={label}
          type={
            type === 'notify'
              ? 'text_medium_14'
              : type === 'outline'
              ? 'text_large_20'
              : type === 'secondary'
              ? 'text_medium_20'
              : 'text_xLarge'
          }
          color={type === 'secondary' ? 'blue' : 'white'}
          customStyle={customStyle}
        />
      )}
      {icon && (
        <View
          style={{
            ...(reverse && styles.reverse),
          }}>
          <Image source={icon} />
        </View>
      )}
      {isLoading && (
        <ActivityIndicator
          size="large"
          color={LIGHT_BLUE_COLOR}
          style={styles.loading}
        />
      )}
    </TouchableOpacity>
  );
};

export default memo(CustomButton);

const styles = StyleSheet.create({
  shadow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  [EButton.default]: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    textAlign: 'center',
    ...st.text_large_7_white,
  },
  [EButton.outline]: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#EDF6FF',
    borderWidth: 2,
    borderRadius: 17,
    paddingVertical: 7,
    paddingHorizontal: 20,
  },
  [EButton.notify]: {
    opacity: 0.9,
    borderRadius: 17,
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: '#00BFFF',
    alignSelf: 'flex-start',
  },
  [EButton.primary]: {
    borderRadius: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 5,
  },
  [EButton.secondary]: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    marginLeft: 20,
  },
  reverse: {
    backgroundColor: GRAY_COLOR,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 50,
  },
});
