import {
  Keyboard,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import CustomText from '../Text';
import CustomButton from '../Button';
import {CloseIcon} from '@theme';

const CustomModal = ({
  children,
  onClose,
  onOk,
}: {
  children: React.ReactNode;
  onClose: () => void;
  onOk: () => Promise<void>;
}) => {
  const onTouchOutside = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <Modal>
      <TouchableWithoutFeedback onPress={onTouchOutside}>
        <View style={styles.modal}>
          <View>
            <View style={styles.title}>
              <CustomText
                text="Upgrade to Service Rescue"
                center
                type="text_medium_30"
                color="blue"
              />
              <CustomButton
                icon={CloseIcon}
                type="secondary"
                onPress={onClose}
              />
            </View>
            {children}
          </View>
          <View style={styles.actions}>
            <CustomButton label="Upgrade" onPress={onOk} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modal: {
    padding: 30,
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actions: {},
});
