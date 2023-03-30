import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {EButton} from '../../../enums';

console.log(EButton);

type ButtonProps = {
  label?: string;
  children?: React.ReactNode;
  type?: keyof typeof EButton;
  customStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const CustomButton = ({
  children,
  label = '',
  type = 'default',
  customStyle,
  onPress,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles['button-container'], styles[EButton[type]], customStyle]}>
      {children ? children : <Text style={styles[EButton[type]]}>{label}</Text>}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  ['button-container']: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  [EButton.default]: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    paddingVertical: 16,
    fontWeight: '700',
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Roboto',
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
