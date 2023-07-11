import React, {
  forwardRef,
  useRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import {StyleSheet, View, TextInput, TextInputProps} from 'react-native';

import CustomText from '../Text';
import {DARK_GRAY_COLOR, GRAY_COLOR, WHITE_COLOR} from '@theme';

interface TextareaProps extends TextInputProps {
  field: string;
  title: string;
  value?: string;
  onChangeText?: (value: string, field: string) => void;
  editable?: boolean;
}

export interface TextareaRef {
  focusInput: () => void;
}

// const Textarea = forwardRef<TextareaRef, TextareaProps>((props, ref) => {
const Textarea = (props, ref) => {
  const textInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    },
  }));

  const handleChangeText = useCallback((value: string) => {
    props.onChangeText(value, props.field);
  }, []);

  return (
    <View style={styles.container}>
      <CustomText text={props.title} type="text_medium_14" />
      <TextInput
        ref={textInputRef}
        {...props}
        multiline
        numberOfLines={3}
        style={styles.input}
        placeholder="Type more infomation"
        placeholderTextColor={DARK_GRAY_COLOR}
        clearTextOnFocus
        value={props?.value || ''}
        onChangeText={handleChangeText}
      />
    </View>
  );
};

export default forwardRef<TextareaRef, TextareaProps>(Textarea);

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  input: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Roboto',
    borderWidth: 1,
    borderColor: GRAY_COLOR,
    color: WHITE_COLOR,
    borderRadius: 8,
    padding: 10,
    height: 120,
    marginTop: 10,
    textAlignVertical: 'top',
  },
});
