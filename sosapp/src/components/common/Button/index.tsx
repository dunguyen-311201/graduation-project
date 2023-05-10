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

type ButtonProps = {
  label?: string;
  children?: React.ReactNode;
  type?: keyof typeof EButton;
  icon?: ImageSourcePropType;
  customStyle?: StyleProp<ViewStyle>;
  paddingVertical?: number;
  paddingHorizontal?: number;
  onPress?: () => void;
};

const styles = StyleSheet.create({
  ['button-container']: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    borderRadius: 10,
  },
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
    borderWidth: 1.7,
    borderRadius: 17,
    paddingVertical: 7,
    paddingHorizontal: 20,
  },
  [EButton.primary]: {
    borderRadius: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  [EButton.secondary]: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowRightIcon: {marginLeft: 20},
});

const CustomButton = ({
  label = '',
  type = 'default',
  icon,
  customStyle,
  onPress,
}: ButtonProps) => {
  let Button;
  const style = styles[EButton[type]];
  switch (type) {
    case 'secondary':
    case 'outline':
      Button = (
        <TouchableOpacity style={[style, customStyle]} onPress={onPress}>
          <CustomText
            text={label}
            type="text_large_20"
            {...(type === 'secondary' && {color: 'blue'})}
          />
          {icon && <Image source={icon} />}
        </TouchableOpacity>
      );
      break;
    case 'primary':
      Button = (
        <TouchableOpacity onPress={onPress} style={[style, customStyle]}>
          <Shadow customStyle={styles.button} paddingVertical={16}>
            <CustomText text={label} type="text_xLarge" />
            {icon && <Image source={icon} style={styles.arrowRightIcon} />}
          </Shadow>
        </TouchableOpacity>
      );
      break;

    default:
      Button = (
        <TouchableOpacity style={[style, customStyle]} onPress={onPress}>
          <CustomText text={label} type="text_xLarge" />
        </TouchableOpacity>
      );
      break;
  }

  return Button;
};

export default memo(CustomButton);
