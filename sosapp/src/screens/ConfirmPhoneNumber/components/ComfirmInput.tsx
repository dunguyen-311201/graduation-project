import {FlatList, StyleSheet, View, TextInput} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import {CustomInput} from '@components/common';

type ComfirmInputProps = {
  code: string;
  onChange: (value: string) => void;
  onFocus: () => void;
};

const ComfirmInput = ({code, onChange, onFocus}: ComfirmInputProps) => {
  const data = Array(6)
    .fill('')
    .map((_, index) => code[index] || '');

  const inputsRef = useRef<TextInput[]>([]);

  useEffect(() => {
    inputsRef.current[0].focus();
  }, []);

  const handleInputChangeText = useCallback(
    (value: string, field?: string) => {
      if (field) {
        const index = parseInt(field, 10);

        onChange((prev: string) => {
          if (value === '' && index > 0) {
            inputsRef.current[index - 1].focus();
          }
          if (prev.length < 5 && value !== '') {
            inputsRef.current[index + 1].focus();
          }

          return (
            prev.substring(0, index) + `${value}` + prev.substring(index + 1, 6)
          );
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
        flex="row"
        value={item}
        customStyle={styles.input}
        inputMode="numeric"
        onFocus={onFocus}
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
    width: 25,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    width: 30,
  },
});
