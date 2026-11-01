import {StyleSheet, View, TextInput} from 'react-native';
import type {TextInputInstance} from 'react-native';
import React, {useCallback, useEffect, useState, useRef, memo} from 'react';

import {tokens} from '@theme';

const {colors, radius} = tokens;
import {CustomText} from '@components';

const CODE_LENGTH = 6;

type ComfirmInputProps = {
  error?: string;
  onChange: (code: string) => void;
};

const ComfirmInput = ({onChange, error}: ComfirmInputProps) => {
  const [digits, setDigits] = useState<string[]>(
    Array.from({length: CODE_LENGTH}, () => ''),
  );
  const textInputRefs = useRef<Array<TextInputInstance | null>>([]);
  const [focused, setFocused] = useState(0);

  useEffect(() => {
    textInputRefs.current.at(0)?.focus();
  }, []);

  const handleInputChangeText = useCallback(
    (value: string, index: number) => {
      const typed = value.replace(/\D/g, '');
      // Two digits means one was typed next to the current one; more is a paste.
      const chars = typed.length === 2 ? typed.slice(-1) : typed;

      const next = [...digits];
      if (chars) {
        chars
          .slice(0, CODE_LENGTH - index)
          .split('')
          .forEach((digit, offset) => {
            next[index + offset] = digit;
          });
      } else {
        next[index] = '';
      }

      setDigits(next);
      onChange(next.join(''));

      if (chars) {
        const target = index + chars.length;
        if (target >= CODE_LENGTH) {
          textInputRefs.current.at(CODE_LENGTH - 1)?.blur();
        } else {
          textInputRefs.current.at(target)?.focus();
        }
      }
    },
    [digits, onChange],
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === 'Backspace' && !digits[index] && index > 0) {
        textInputRefs.current.at(index - 1)?.focus();
      }
    },
    [digits],
  );

  return (
    <View style={styles.container}>
      <View style={styles.group}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => {
              textInputRefs.current[index] = ref;
            }}
            maxLength={CODE_LENGTH}
            value={digit}
            inputMode="numeric"
            autoComplete={index === 0 ? 'sms-otp' : 'off'}
            textContentType="oneTimeCode"
            accessibilityLabel={`Digit ${index + 1} of ${CODE_LENGTH}`}
            onChangeText={value => handleInputChangeText(value, index)}
            onKeyPress={({nativeEvent}) =>
              handleKeyPress(nativeEvent.key, index)
            }
            onFocus={() => setFocused(index)}
            style={[
              styles.input,
              (focused === index || digit) && styles.inputActive,
              error ? styles.inputError : null,
            ]}
            selectTextOnFocus
          />
        ))}
      </View>
      <CustomText text={error} color="red" type="text_medium_14" />
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
    width: 48,
    height: 56,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  inputActive: {borderColor: colors.primary},
  inputError: {borderColor: colors.sos},
});
