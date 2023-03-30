import {StyleProp, StyleSheet, TextInput, TextStyle, View} from 'react-native';
import React, {useCallback} from 'react';
import CustomText from '../Text';
import {TEXT_COLOR} from '@theme/color';

type CustomInputProps = {
  title?: string;
  field: string;
  value: string;
  errorMessage?: string;
  titleStyle?: StyleProp<TextStyle>;
  errorMessageStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  onChangeText: (value: string, field: string) => void;
  onBlur?: (field: string) => void;
  onFocus?: (field: string) => void;
};
const CustomInput = ({
  field,
  errorMessage,
  title,
  value,
  titleStyle,
  errorMessageStyle,
  valueStyle,
  onChangeText,
  onBlur,
  onFocus,
}: CustomInputProps) => {
  const _onChangeText = useCallback(
    (_value: string) => {
      onChangeText(_value, field);
    },
    [onChangeText, field],
  );
  const _onFocus = useCallback(() => {
    onFocus && onFocus(field);
  }, [onFocus, field]);
  const _onBlur = useCallback(() => {
    onBlur && onBlur(field);
  }, [onBlur, field]);

  return (
    <View style={styles.inputgroup}>
      {title && (
        <CustomText
          text={title}
          style={['fw5', 'fs6', 'cga']}
          customStyle={titleStyle}
        />
      )}
      <TextInput
        value={value}
        style={[styles.inputControl, valueStyle]}
        onChangeText={_onChangeText}
        onBlur={_onBlur}
        onFocus={_onFocus}
      />
      {errorMessage && (
        <CustomText
          text={errorMessage}
          style={['fw5', 'fs6']}
          customStyle={errorMessageStyle}
        />
      )}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  inputgroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputControl: {
    borderBottomColor: TEXT_COLOR,
    borderBottomWidth: 1,
    flex: 1,
  },
});
