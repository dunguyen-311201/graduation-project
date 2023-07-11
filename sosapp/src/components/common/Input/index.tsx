import {
  DARK_GRAY_COLOR,
  EyeIcon,
  HideIcon,
  TEXT_COLOR,
  WHITE_COLOR,
} from '@theme';
import {
  InputModeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
} from 'react-native';
import React, {forwardRef, useCallback, useState} from 'react';

import CustomButton from '../Button';
import CustomText from '../Text';

export type CustomInputProps = {
  title?: string;
  field: string;
  value?: string;
  inputMode?: InputModeOptions | 'password';
  errorMessage?: string;
  titleStyle?: TextStyle;
  errorMessageStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  onChangeText?: (value: string, field: string) => void;
  onBlur?: (field: string) => void;
  onFocus?: (field: string) => void;
  maxLength?: number;
  placeholder?: string;
  onEndEditing?: (feild: string) => void;
  nColumn?: number;
  border?: boolean;
  editable?: boolean;
  width?: number;
  row?: boolean;
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
    editable = true,
    width,
    nColumn = 1,
    border,
    row,
  } = props;

  const [secureTextEntry, setSecureTextEntry] = useState(
    inputMode === 'password',
  );

  const handleChangeText = useCallback((_value: string) => {
    onChangeText && onChangeText(_value, field);
  }, []);

  const handleFocus = useCallback(() => {
    onFocus && onFocus(field);
  }, [onFocus, field]);

  const handleBlur = useCallback(() => {
    onBlur && onBlur(field);
  }, [field, onBlur]);

  const handleEndEdit = useCallback(() => {
    onEndEditing && onEndEditing(field);
  }, [onEndEditing, field]);

  const handleSecretPassword = useCallback(() => {
    setSecureTextEntry(prev => !prev);
  }, []);

  return (
    <View style={{width: width || `${100 / nColumn}%`}}>
      <View
        style={{
          ...styles.inputgroup,
          ...(row && styles.row),
          ...(errorMessage && styles.error),
        }}>
        {title && (
          <CustomText
            text={title}
            type={row ? 'text_medium_24' : 'text_medium_14'}
            customStyle={{
              ...styles.title,
              ...titleStyle,
            }}
          />
        )}
        <TextInput
          ref={ref}
          value={value}
          selectTextOnFocus
          editable={editable}
          onBlur={handleBlur}
          onFocus={handleFocus}
          maxLength={maxLength}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          placeholderTextColor={DARK_GRAY_COLOR}
          onEndEditing={handleEndEdit}
          {...(inputMode === 'password' ? {secureTextEntry} : {inputMode})}
          style={[
            styles.input,
            {...(!row && styles.column)},
            {...(!editable && {opacity: 0.5})},
            {...(border ? styles.border : styles.default)},
            valueStyle,
          ]}
        />
        {inputMode === 'password' && (
          <CustomButton
            icon={secureTextEntry ? EyeIcon : HideIcon}
            type="secondary"
            customStyle={styles.password}
            onPress={handleSecretPassword}
          />
        )}
      </View>
      {errorMessage && (
        <CustomText text={errorMessage} type="text_medium_14" color="red" />
      )}
    </View>
  );
};

export default forwardRef(CustomInput);

const styles = StyleSheet.create({
  inputgroup: {
    position: 'relative',
    zIndex: 1,
  },
  title: {
    marginRight: 10,
  },
  default: {
    flex: 1,
  },
  border: {
    borderColor: TEXT_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  input: {
    color: DARK_GRAY_COLOR,
    fontSize: 20,
    fontWeight: '400',
    paddingHorizontal: 10,
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
  },
  error: {
    borderBottomColor: 'red',
  },
  password: {
    maxWidth: 30,
    maxHeight: 30,
    position: 'absolute',
    zIndex: 2,
    right: 10,
    top: '50%',
    transform: [{translateY: 5}],
  },
});
