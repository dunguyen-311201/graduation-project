import {StyleSheet, Modal, View} from 'react-native';
import React from 'react';

import {WHITE_COLOR} from '@theme';
import CustomButton from '../Button';
import CustomText from '../Text';

type CustomModalProps = {
  isVisible: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onOk: () => void;
};

const CustomModal = ({
  isVisible,
  description,
  title,
  onClose,
  onOk,
}: CustomModalProps) => {
  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.message}>
          <View>
            <CustomText text={title} type="text_large_20" color="black" />
            <CustomText
              text={description}
              type="text_medium_14"
              color="black"
            />
          </View>
          <View style={styles.actions}>
            <CustomButton label="OK" type="secondary" onPress={onOk} />
            <CustomButton label="Cancel" type="secondary" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  message: {
    backgroundColor: WHITE_COLOR,
    width: '80%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'center',
    marginTop: 5,
    borderRadius: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
