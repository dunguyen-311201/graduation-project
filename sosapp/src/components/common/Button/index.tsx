import {
  StyleProp,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import React, {memo} from 'react';

import {EButton} from '@enums';
import Shadow from '../../Shadow';
import {Styles as st} from '@utils';
import CustomText from '../Text';
import {DARK_BLUE_COLOR} from '@theme/color';

type ButtonProps = {
  label?: string;
  children?: React.ReactNode;
  type?: keyof typeof EButton;
  icon?: ImageSourcePropType;
  customStyle?: StyleProp<ViewStyle>;
  paddingVertical?: number;
  paddingHorizontal?: number;
  onPress?: () => void;
  disabled?: boolean;
  iconSize?: {height: number; width: number};
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
}: ButtonProps) => {
  const textSize =
    type === 'notify'
      ? 'text_medium_14'
      : type === 'outline'
      ? 'text_large_20'
      : 'text_xLarge';

  if (type === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles[EButton[type]], customStyle]}>
        <Shadow customStyle={styles.shadow} paddingVertical={16}>
          <CustomText text={label} type="text_xLarge" />
          {icon && <Image source={icon} style={[styles.icon, iconSize]} />}
        </Shadow>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles[EButton[type]],
        {...(disabled && {backgroundColor: '#eeeeee'})},
        customStyle,
      ]}>
      {children}
      {label && <CustomText text={label} type={textSize} />}
      {icon && <Image source={icon} style={[iconSize]} />}
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
  icon: {marginLeft: 30},
  [EButton.default]: {
    backgroundColor: '#000000',
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
    paddingVertical: 4,
    paddingHorizontal: 20,
    backgroundColor: DARK_BLUE_COLOR,
    alignSelf: 'flex-start',
  },
  [EButton.primary]: {
    borderRadius: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  [EButton.secondary]: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
