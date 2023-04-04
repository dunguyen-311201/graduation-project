import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {memo} from 'react';
import {EButton} from '../../../enums';
import Shadow from '../../Shadow';
import {Styles as st} from '@utils';

type ButtonProps = {
  label?: string;
  children?: React.ReactNode;
  type?: keyof typeof EButton;
  customStyle?: StyleProp<ViewStyle>;
  paddingVertical?: number;
  paddingHorizontal?: number;
  onPress?: () => void;
};

const CustomButton = ({
  children,
  label = '',
  type = 'default',
  customStyle,
  paddingHorizontal,
  paddingVertical,
  onPress,
}: ButtonProps) => {
  if (label) {
    if (type === 'primary') {
      type = 'default';
    }

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles['button-container'],
          styles[EButton[type]],
          customStyle,
        ]}>
        <Text
          style={[styles[EButton[type]], {paddingHorizontal, paddingVertical}]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles['button-container'], styles[EButton[type]], customStyle]}>
      {type !== 'primary' ? (
        children
      ) : (
        <Shadow customStyle={styles.button} paddingVertical={16}>
          {children}
        </Shadow>
      )}
    </TouchableOpacity>
  );
};

export default memo(CustomButton);

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
    backgroundColor: 'transparent',
    borderColor: '#EDF6FF',
    borderWidth: 1.7,
    borderRadius: 17,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  [EButton.primary]: {
    borderRadius: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
