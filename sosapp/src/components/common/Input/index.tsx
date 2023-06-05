import {
  InputModeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {forwardRef, useCallback} from 'react';
import CustomText from '../Text';
import {DARK_GRAY_COLOR, TEXT_COLOR, WHITE_COLOR} from '@theme';

type CustomInputProps = {
  title?: string;
  field: string;
  value?: string;
  inputMode?: InputModeOptions;
  errorMessage?: string;
  titleStyle?: TextStyle;
  errorMessageStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  onChangeText?: (value: string, field: string) => void;
  onBlur?: (field?: string) => void;
  onFocus?: (field?: string) => void;
  maxLength?: number;
  placeholder?: string;
  onEndEditing?: (feild: string) => void;
  customStyle?: ViewStyle;
  border?: boolean;
  editable?: boolean;
  flex?: 'row' | 'column';
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
    editable,
    customStyle,
    border,
    flex = 'column',
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
    onEndEditing && onEndEditing(field);
  }, [onEndEditing, field]);

  return (
    <View
      style={{
        ...styles.inputgroup,
        ...customStyle,
        ...(flex === 'row' && styles.row),
      }}>
      {title && (
        <CustomText
          text={title}
          type={flex === 'row' ? 'text_medium_24' : 'text_medium_14'}
          customStyle={{
            ...styles.title,
            ...titleStyle,
          }}
        />
      )}
      <TextInput
        value={value}
        ref={ref}
        editable={editable}
        style={[
          styles.input,
          {...(flex === 'column' && styles.column)},
          {...(border && styles.border)},
          valueStyle,
        ]}
        onChangeText={_onChangeText}
        onBlur={_onBlur}
        onFocus={_onFocus}
        inputMode={inputMode}
        maxLength={maxLength}
        selectTextOnFocus
        placeholder={placeholder}
        placeholderTextColor={DARK_GRAY_COLOR}
        onEndEditing={_onEndEditing}
        keyboardType="phone-pad"
      />
      {errorMessage && <CustomText text={errorMessage} />}
    </View>
  );
};

export default forwardRef(CustomInput);

const styles = StyleSheet.create({
  inputgroup: {
    marginBottom: 10,
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
  },
  column: {
    borderColor: WHITE_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    color: WHITE_COLOR,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: WHITE_COLOR,
    borderBottomWidth: 1,
  },
});
