import React, {
  forwardRef,
  useRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import {StyleSheet, View, TextInput, TextInputProps} from 'react-native';
import type {TextInputInstance} from 'react-native';

import Txt from '../../ui/Txt';
import {colors, radius, space, type as typeScale} from '../../../theme/tokens';
import {themedStyles} from '../../../theme/tokens';

interface TextareaProps extends Omit<TextInputProps, 'onChangeText'> {
  field: string;
  title: string;
  value?: string;
  onChangeText?: (value: string, field: string) => void;
  editable?: boolean;
}

export interface TextareaRef {
  focusInput: () => void;
}

const Textarea = (
  props: TextareaProps,
  ref: React.ForwardedRef<TextareaRef>,
) => {
  const textInputRef = useRef<TextInputInstance>(null);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    },
  }));

  const handleChangeText = useCallback((value: string) => {
    props.onChangeText?.(value, props.field);
  }, []);

  return (
    <View style={styles.container}>
      <Txt variant="label" color={colors.textMuted}>
        {props.title}
      </Txt>
      <TextInput
        ref={textInputRef}
        {...props}
        multiline
        numberOfLines={3}
        style={styles.input}
        placeholder="Add more information"
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={props.title}
        clearTextOnFocus
        value={props?.value || ''}
        onChangeText={handleChangeText}
      />
    </View>
  );
};

export default forwardRef<TextareaRef, TextareaProps>(Textarea);

const styles = themedStyles(() => StyleSheet.create({
  container: {rowGap: space.sm},
  input: {
    minHeight: 120,
    padding: space.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: typeScale.body.fontSize,
    lineHeight: typeScale.body.lineHeight,
    textAlignVertical: 'top',
  },
}));
