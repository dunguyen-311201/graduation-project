import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';

import {DARK_GRAY_COLOR, GRAY_COLOR, WHITE_COLOR} from '@theme';
import CustomText from '../Text';

type TextareaProps = {
  value: string;
  onChangeText: (value: string, field: string) => void;
  field: string;
  title: string;
};

const Textarea = ({field, onChangeText, value, title}: TextareaProps) => {
  const handleTextChange = (text: string) => {
    onChangeText(text, field);
  };

  return (
    <View style={styles.container}>
      <CustomText text={title} type="text_medium_14" />
      <TextInput
        multiline
        numberOfLines={3}
        style={styles.input}
        placeholder="Type more infomation"
        placeholderTextColor={DARK_GRAY_COLOR}
        clearTextOnFocus
        value={value}
        onChangeText={handleTextChange}
      />
    </View>
  );
};

export default Textarea;

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
