import {StyleSheet, Modal, View} from 'react-native';
import React, {useState, useCallback} from 'react';
import {CustomButton, CustomInput} from '@components';

type ModalProps = {
  field: string;
  title: string;
  initValue: string;
  onComplete: (value: string, field?: string) => void;
};

const CustomModal = ({field, onComplete, title, initValue}: ModalProps) => {
  const [value, setValue] = useState(initValue);

  const handleComplete = useCallback(() => {
    onComplete(value, field);
  }, [field, onComplete, value]);

  return (
    <Modal>
      <CustomInput
        field={field}
        value={value}
        onChangeText={setValue}
        title={title}
      />
      <CustomButton label="OK" onPress={handleComplete} type="default" />
      <CustomButton label="OK" onPress={handleComplete} type="default" />
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({});
