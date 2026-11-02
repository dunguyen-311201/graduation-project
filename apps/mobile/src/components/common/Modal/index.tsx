import {
  Keyboard,
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useCallback} from 'react';

import CustomText from '../Text';
import CustomButton from '../Button';
import {CloseIcon} from '@theme';
import {colors as themeColors, themedStyles} from '../../../theme/tokens';

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
                  iconTint={themeColors.text}
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

const styles = themedStyles(() => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: themeColors.surfaceRaised,
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
}));
