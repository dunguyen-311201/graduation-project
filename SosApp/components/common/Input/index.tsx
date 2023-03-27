import {KeyboardTypeOptions, StyleSheet, TextInput, View} from 'react-native';
import React, {useCallback} from 'react';
import CustomText from '../Text';
import {WHITE_COLOR} from '../../../themes';

export type InputProps = {
  feild: string;
  label?: string;
  value: string;
  type?: KeyboardTypeOptions;
  errorMessage?: string;
  placeholder?: string;
  onChangeText: (value: string, field: string) => void;
  onFocus?: (value: string) => void;
  onBlur?: (field: string) => void;
};

const CustomInput = ({
  label,
  feild,
  value,
  onBlur,
  type = 'default',
  onChangeText,
  placeholder = '',
  onFocus,
  errorMessage,
}: InputProps) => {
  const _onChangeText = useCallback(
    (currentValue: string) => {
      onChangeText(currentValue, feild);
    },
    [feild, onChangeText],
  );

  const _onBlur = useCallback(() => {
    onBlur && onBlur(feild);
  }, [feild, onBlur]);

  const _onFocus = useCallback(() => {
    onFocus && onFocus(feild);
  }, [feild, onFocus]);

  return (
    <View style={styles.inputGroup}>
      {label && <CustomText text={label} />}
      <TextInput
        value={value}
        keyboardType={type}
        style={styles.input}
        onBlur={_onBlur}
        placeholder={placeholder}
        onChangeText={_onChangeText}
        onEndEditing={_onFocus}
      />
      {errorMessage && <CustomText text={errorMessage} />}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  inputGroup: {
    flex: 8,
    height: '100%',
  },
  label: {},
  input: {
    color: WHITE_COLOR,
    fontSize: 24,
    fontWeight: '500',
    fontFamily: 'Roboto',
    borderBottomWidth: 1,
    borderBottomColor: WHITE_COLOR,
  },
  error: {},
});
