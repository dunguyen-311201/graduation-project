import {StyleSheet, View, TextInput} from 'react-native';
import React, {useCallback, useEffect, useState, useRef, memo} from 'react';

import {WHITE_COLOR} from '@theme';
import {CustomText} from '@components';

type ComfirmInputProps = {
  code: string;
  error: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

const ComfirmInput = ({onChange, error}: ComfirmInputProps) => {
  const [code, setCode] = useState('');
  const textInputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    textInputRefs.current.at(0)?.focus();
  }, []);

  const handleInputChangeText = useCallback(
    (value: string, index: number) => {
      let l = false;
      setCode(prev => {
        const updatedCode = prev.split(' ');
        updatedCode[index] = value;

        if (value.length === 0 && index > 0) {
          l = true;
          textInputRefs.current.at(index - 1)?.focus();
        }
        if (index === 5) {
          onChange(updatedCode.join(''));
          textInputRefs.current.at(5)?.blur();
        }

        return updatedCode.join(' ');
      });

      if (index < 5 && value.length === 1 && !l) {
        textInputRefs.current.at(index + 1)?.focus();
        return;
      }
    },
    [textInputRefs],
  );

  return (
    <View style={styles.container}>
      <View style={styles.group}>
        {Array.from({length: 6}, (_, index) => (
          <TextInput
            key={index}
            ref={ref => (textInputRefs.current[index] = ref)}
            maxLength={1}
            value={code.split(' ')[index]}
            inputMode="numeric"
            onChangeText={value => handleInputChangeText(value, index)}
            style={styles.input}
            selectTextOnFocus
          />
        ))}
      </View>
      <CustomText text={error} color="red" type="text_medium_12" />
    </View>
  );
};

export default memo(ComfirmInput);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    rowGap: 10,
  },
  group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: WHITE_COLOR,
    color: WHITE_COLOR,
  },
});
