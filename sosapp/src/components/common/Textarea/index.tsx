import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';

import {GRAY_COLOR, WHITE_COLOR} from '@theme';

type TextareaProps = {
  value: string;
  onChangeText: (value: string, field?: string) => void;
  field: string;
};

const Textarea = ({field, onChangeText, value}: TextareaProps) => {
  const handleTextChange = (text: string) => {
    onChangeText(text, field);
  };

  return (
    <View>
      <TextInput
        multiline
        numberOfLines={3}
        style={styles.input}
        placeholder="Type more infomation"
        placeholderTextColor={WHITE_COLOR}
        clearTextOnFocus
        value={value}
        onChangeText={handleTextChange}
      />
    </View>
  );
};

export default Textarea;

const styles = StyleSheet.create({
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
