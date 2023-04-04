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
import {TEXT_COLOR} from '@theme/color';

type CustomInputProps = {
  title?: string;
  field: string;
  value?: string;
  inputMode?: InputModeOptions;
  errorMessage?: string;
  titleStyle?: TextStyle;
  errorMessageStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  onChangeText: (value: string, field: string) => void;
  onBlur?: (field: string) => void;
  onFocus?: (field: string) => void;
  marginLeft?: number;
  maxLength?: number;
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
    onBlur,
    onFocus,
  } = props;

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
    <View style={[styles.inputgroup, {marginLeft}]}>
      {title && <CustomText text={title} customStyle={titleStyle} />}
      <TextInput
        value={value}
        ref={ref}
        style={[styles.inputControl, valueStyle]}
        onChangeText={_onChangeText}
        onBlur={_onBlur}
        onFocus={_onFocus}
        inputMode={inputMode}
        maxLength={maxLength}
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
    flex: 2,
  },
  inputControl: {
    flex: 1,
  },
});
