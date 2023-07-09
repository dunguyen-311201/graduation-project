import {TEXT_COLOR} from '@theme';
import React, {useCallback, useContext} from 'react';
import {StyleSheet, View} from 'react-native';

import CloseButton from '../CloseButton';
import {CustomButton, CustomText} from '../common';
import {TNotification} from '@types';
import OptionsButton from '../OptionButton';
import {Context} from '@context';
import {ERole} from '@enums/EUser';
import {TouchableWithoutFeedback} from 'react-native';
import {Image} from 'react-native';

const Notify = ({
  onClose,
  onPress,
  onReject,
  notify,
}: {
  notify: TNotification;
  onClose?: () => void;
  onPress: (notify?: TNotification) => void;
  onReject?: () => Promise<void>;
}) => {
  const {currentUser} = useContext(Context);

  const handlePress = useCallback(() => {
    onPress && onPress(notify);
  }, [notify]);

  return (
    <TouchableWithoutFeedback {...(onClose && {onPress: handlePress})}>
      <View style={styles.container}>
        <View style={styles.content}>
          {notify.imageUrl && (
            <Image source={{uri: notify.imageUrl}} style={styles.image} />
          )}

          <View style={styles.describe}>
            <CustomText
              text={notify.title}
              type="text_medium_18"
              color="blue"
            />
            <CustomText
              text={notify.body}
              type="text_medium_16"
              color="black"
            />
            {notify.time && (
              <CustomText
                text={new Date(notify.time).toLocaleString()}
                type="text_medium_14"
                color="black"
              />
            )}
          </View>
          <View style={styles.menu}>
            {onClose ? (
              <CloseButton top={10} right={10} onPress={onClose} />
            ) : (
              <OptionsButton onPress={handlePress} />
            )}
          </View>
        </View>

        {onClose &&
          currentUser?.role === ERole.WORKER &&
          notify.title !== 'NOTIFICATION' && (
            <View style={styles.actions}>
              <CustomButton type="notify" label="View" onPress={handlePress} />
              <CustomButton type="notify" label="Deny" onPress={onReject} />
            </View>
          )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Notify;

const styles = StyleSheet.create({
  container: {
    backgroundColor: TEXT_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  content: {flexDirection: 'row', flex: 12, columnGap: 5},
  describe: {flex: 11, rowGap: 2},
  actions: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 5,
  },
  image: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 8,
  },
  menu: {
    flex: 1,
  },
});
