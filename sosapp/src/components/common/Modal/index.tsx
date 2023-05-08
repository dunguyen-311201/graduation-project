import {StyleSheet, Modal, View} from 'react-native';
import React, {useCallback, useContext} from 'react';

import {WHITE_COLOR} from '@theme';
import {Context} from '@context';
import {CustomButton, CustomText} from '@components';

type CustomModalProps = {children: React.ReactNode};

const CustomModal = ({children}: CustomModalProps) => {
  const {isVisibleNotification, setIsVisibleNotification} = useContext(Context);

  const handleCloseModal = useCallback(() => {
    setIsVisibleNotification(false);
  }, [setIsVisibleNotification]);

  return (
    <Modal
      animationType="slide"
      visible={isVisibleNotification}
      // transparent={true}
      onRequestClose={() => {
        setIsVisibleNotification(!isVisibleNotification);
      }}>
      {children}
      {/* <View style={styles.message}>
        <CustomText text="Title" type="text_large_20" color="black" />
        <CustomText text="Details" type="text_medium_14" color="black" />
      </View>
    </View> */}
      <View style={styles.actions}>
        <CustomButton label="OK" type="secondary" />
        <CustomButton
          label="Cancel"
          type="secondary"
          onPress={handleCloseModal}
        />
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
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
