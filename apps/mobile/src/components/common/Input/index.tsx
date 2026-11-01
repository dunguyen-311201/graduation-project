import {EyeIcon, HideIcon} from '@theme';
import {TOUCH, colors, radius, space, type as typeScale} from '../../../theme/tokens';
import {
  InputModeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
} from 'react-native';
import type {TextInputInstance} from 'react-native';
import React, {forwardRef, useCallback, useState} from 'react';

import CustomButton from '../Button';
import Txt from '../../ui/Txt';

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
  /** Kept for old callers; every input now shares one look. */
  border?: boolean;
  editable?: boolean;
  width?: number;
  row?: boolean;
};
const CustomInput: React.ForwardRefRenderFunction<
  TextInputInstance,
  CustomInputProps
> = (props, ref) => {
  const {
    field,
    errorMessage,
    title,
    value = '',
    inputMode = 'text',
    titleStyle,
    errorMessageStyle,
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
  } = props;

  const [secureTextEntry, setSecureTextEntry] = useState(
    inputMode === 'password',
  );
  const [focused, setFocused] = useState(false);

  const handleChangeText = useCallback((_value: string) => {
    onChangeText && onChangeText(_value, field);
  }, []);

  const handleFocus = useCallback(() => {
    setFocused(true);
    onFocus && onFocus(field);
  }, [onFocus, field]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    onBlur && onBlur(field);
  }, [field, onBlur]);

  const handleEndEdit = useCallback(() => {
    onEndEditing && onEndEditing(field);
  }, [onEndEditing, field]);

  const handleSecretPassword = useCallback(() => {
    setSecureTextEntry(prev => !prev);
  }, []);

  return (
    <View style={[styles.group, {width: width || `${100 / nColumn}%`}]}>
      {title && (
        <Txt variant="label" color={colors.textMuted} style={titleStyle}>
          {title}
        </Txt>
      )}
      <View
        style={[
          styles.field,
          focused && styles.focused,
          Boolean(errorMessage) && styles.invalid,
          !editable && styles.readOnly,
        ]}>
        <TextInput
          ref={ref}
          value={value}
          selectTextOnFocus
          accessibilityLabel={title}
          autoCapitalize={inputMode === 'text' ? 'sentences' : 'none'}
          autoCorrect={inputMode === 'text'}
          editable={editable}
          onBlur={handleBlur}
          onFocus={handleFocus}
          maxLength={maxLength}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          placeholderTextColor={colors.textMuted}
          onEndEditing={handleEndEdit}
          {...(inputMode === 'password' ? {secureTextEntry} : {inputMode})}
          style={[styles.input, valueStyle]}
        />
        {inputMode === 'password' && (
          <CustomButton
            icon={secureTextEntry ? EyeIcon : HideIcon}
            iconSize={styles.eyeIcon}
            type="secondary"
            accessibilityLabel={secureTextEntry ? 'Show password' : 'Hide password'}
            onPress={handleSecretPassword}
          />
        )}
      </View>
      {errorMessage && (
        <Txt
          variant="caption"
          color={colors.sos}
          style={errorMessageStyle}
          accessibilityLiveRegion="polite">
          {errorMessage}
        </Txt>
      )}
    </View>
  );
};

export default forwardRef(CustomInput);

const styles = StyleSheet.create({
  group: {rowGap: space.sm},
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TOUCH + 4,
    paddingLeft: space.lg,
    paddingRight: space.xs,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  focused: {borderColor: colors.primary},
  invalid: {borderColor: colors.sos},
  readOnly: {opacity: 0.6},
  input: {
    flex: 1,
    fontSize: typeScale.body.fontSize,
    color: colors.text,
    paddingVertical: space.md,
    paddingRight: space.md,
  },
  eyeIcon: {width: 22, height: 22},
});
