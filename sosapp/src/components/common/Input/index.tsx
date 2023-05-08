import {
  InputModeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {forwardRef, memo, useCallback} from 'react';
import CustomText from '../Text';
import {DARK_GRAY_COLOR, TEXT_COLOR, WHITE_COLOR} from '@theme';

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
  maxLength?: number;
  nColumn?: number;
  placeholder?: string;
  onEndEditing?: (feild: string) => void;
  customStyle?: StyleProp<ViewStyle>;
  border?: boolean;
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
    maxLength = 30,
    onChangeText,
    placeholder,
    onBlur,
    onFocus,
    onEndEditing,
    customStyle,
    nColumn = 1,
    border,
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
          ...{width: `${100 / (nColumn + nColumn * 0.1)}%`},
          ...(!border && styles.inputBorder),
        },
        customStyle,
      ]}>
      {title && (
        <CustomText
          text={title}
          type="text_regular_20"
          customStyle={{...styles.title, ...titleStyle}}
        />
      )}
      <TextInput
        value={value}
        ref={ref}
        style={[styles.input, valueStyle, {...(border && styles.border)}]}
        onChangeText={_onChangeText}
        onBlur={_onBlur}
        onFocus={_onFocus}
        inputMode={inputMode}
        maxLength={maxLength}
        selectTextOnFocus
        placeholder={placeholder}
        placeholderTextColor={WHITE_COLOR}
        onEndEditing={_onEndEditing}
        keyboardType="phone-pad"
      />
      {errorMessage && <CustomText text={errorMessage} />}
    </View>
  );
};

export default memo(forwardRef(CustomInput));

const styles = StyleSheet.create({
  inputgroup: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // width: '100%',
  },
  inputBorder: {borderBottomColor: TEXT_COLOR, borderBottomWidth: 1},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginRight: 10,
  },
  border: {
    borderColor: TEXT_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    color: DARK_GRAY_COLOR,
    fontSize: 20,
    fontWeight: '400',
    // flex: 1,
  },
});
