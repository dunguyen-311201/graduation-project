import {
  InputModeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
} from 'react-native';
import React, {forwardRef, memo, useCallback} from 'react';
import CustomText from '../Text';
import {TEXT_COLOR} from '@theme';

type CustomInputProps = {
  title?: string;
  field?: string;
  value?: string;
  inputMode?: InputModeOptions;
  errorMessage?: string;
  titleStyle?: TextStyle;
  errorMessageStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  onChangeText?: (value: string, field?: string) => void;
  onBlur?: (field?: string) => void;
  onFocus?: (field?: string) => void;
  marginLeft?: number;
  maxLength?: number;
  nColumn?: number;
  placeholder?: string;
  onEndEditing?: (feild: string) => void;
};
const CustomInput: React.ForwardRefRenderFunction<
  TextInput,
  CustomInputProps
> = (props, ref) => {
  const {
    field,
    errorMessage,
    title,
    value = '',
    inputMode = 'text',
    titleStyle,
    valueStyle,
    maxLength,
    marginLeft,
    onChangeText,
    placeholder,
    onBlur,
    onFocus,
    nColumn,
    onEndEditing,
  } = props;

  const _onChangeText = useCallback(
    (_value: string) => {
      onChangeText && onChangeText(_value, field);
    },
    [onChangeText, field],
  );

  const _onFocus = useCallback(() => {
    onFocus && onFocus(field);
  }, [onFocus, field]);

  const _onBlur = useCallback(() => {
    onBlur && onBlur(field);
  }, [onBlur, field]);

  const _onEndEditing = useCallback(() => {
    onEndEditing && field && onEndEditing(field);
  }, [onEndEditing, field]);

  return (
    <View
      style={[
        styles.inputgroup,
        {
          marginLeft,
          ...(nColumn && {width: `${100 / (nColumn + nColumn * 0.1)}%`}),
        },
      ]}>
      {title && <CustomText text={title} customStyle={titleStyle} />}
      <TextInput
        value={value}
        ref={ref}
        style={[styles.input, valueStyle]}
        onChangeText={_onChangeText}
        onBlur={_onBlur}
        onFocus={_onFocus}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        onEndEditing={_onEndEditing}
      />
      {errorMessage && <CustomText text={errorMessage} />}
    </View>
  );
};

export default memo(forwardRef(CustomInput));

const styles = StyleSheet.create({
  inputgroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: TEXT_COLOR,
    borderBottomWidth: 1,
    width: '78%',
  },
  input: {
    width: '100%',
  },
});
