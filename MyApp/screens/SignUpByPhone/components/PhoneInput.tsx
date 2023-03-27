import {StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import {NationImage} from '../../../components/common/NationSelect/components/NationOption';
import {NationProps} from '../../../types';
import {CustomInput, CustomText} from '../../../components';
import {InputProps} from '../../../components/common/Input';

const PhoneInput = ({
  uri,
  code,
  feild,
  value,
  onVisibleDropDown,
  onChangeText,
}: NationProps & InputProps & {onVisibleDropDown: () => void}) => {
  const _handleChangeText = useCallback(
    (currentValue: string, field: string) => {
      onChangeText(currentValue, field);
    },
    [onChangeText],
  );

  return (
    <View style={styles.container}>
      <NationImage uri={uri} isDropIcon={true} onPress={onVisibleDropDown} />
      <CustomText text={code} size="xnormal" bold />
      <CustomInput
        value={value}
        onChangeText={_handleChangeText}
        feild={feild}
        type="phone-pad"
      />
    </View>
  );
};

export default PhoneInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
