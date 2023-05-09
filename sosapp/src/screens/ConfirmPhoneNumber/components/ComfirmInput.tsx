import {FlatList, StyleSheet, View, TextInput} from 'react-native';
import React, {useCallback, useRef} from 'react';
import {CustomInput} from '@components/common';

type ComfirmInputProps = {
  code: string;
  onChange: (value: string) => void;
};

const ComfirmInput = ({code, onChange}: ComfirmInputProps) => {
  const data = Array(6)
    .fill('')
    .map((_, index) => code[index] || '');

  const inputsRef = useRef<TextInput[]>([]);

  const handleInputChangeText = useCallback(
    (value: string, field?: string) => {
      if (field) {
        const index = parseInt(field, 10);

        onChange((prev: string) => {
          const _code =
            prev.substring(0, index) +
            value +
            prev.substring(index + 1, prev.length);
          if (prev.length > index && index > 0) {
            inputsRef.current[index - 1].focus();
          } else if (index < 5) {
            if (_code.length > 0) {
              inputsRef.current[index + 1].focus();
            }
          }
          return _code;
        });
      }
    },
    [onChange],
  );

  const renderItem = useCallback(
    ({item, index}: {index: number; item: string}) => (
      <CustomInput
        maxLength={1}
        field={index + ''}
        value={item}
        customStyle={styles.input}
        inputMode="numeric"
        onChangeText={handleInputChangeText}
        valueStyle={styles.text}
        ref={ref => (inputsRef.current[index] = ref)}
      />
    ),
    [handleInputChangeText],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const keyExtractor = useCallback(
    (item: string, index: number) => item + index,
    [],
  );

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default ComfirmInput;

const styles = StyleSheet.create({
  separator: {
    width: 30,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    width: 25,
  },
});
