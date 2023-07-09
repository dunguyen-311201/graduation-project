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
import {CloseIcon, WHITE_COLOR} from '@theme';

const CustomModal = ({
  children,
  title,
  onClose,
  visible,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  onOk?: () => Promise<void>;
  visible: boolean;
}) => {
  // const [loading, setLoading] = useState(false);

  const onTouchOutside = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onTouchOutside}>
          <View style={styles.content}>
            <View>
              <View style={styles.header}>
                <CustomText
                  text={title}
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
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: WHITE_COLOR,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: '80%',
    maxHeight: '50%',
  },
  modal: {
    padding: 30,
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {},
});
