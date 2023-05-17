import {Pressable, StyleSheet, View} from 'react-native';
import React, {useCallback, memo, useEffect, useState} from 'react';

import {WHITE_COLOR, ToLocationIcon} from '@theme';
import {Location, TMessage} from '@types';
import {CustomButton, CustomText} from '../common';
import {useAuth, useMessage} from '@hooks';
import {EMessage} from '@enums';
import {ERROR_CODE} from '@constants/api';

const MessageInfo = ({
  data,
  onMap,
  onLongPress,
}: {
  data: TMessage;
  onMap: (location: Location) => void;
  onLongPress: (uid: string) => void;
}) => {
  const {onComfirm, onComplete} = useMessage(data.uid);

  const [message, setMessage] = useState<TMessage>(data);

  const [isVisible, setIsVisible] = useState(false);

  const {currentUser} = useAuth();

  useEffect(() => {
    data && setMessage(data);
  }, [data]);

  const handleGoMap = useCallback(() => {
    if (data.location) {
      onMap(data.location);
    }
  }, [data.location, onMap]);

  const handleLongPress = useCallback(() => {
    data.uid && onLongPress(data.uid);
  }, [data, onLongPress]);

  const handleComfirm = useCallback(async () => {
    setIsVisible(true);
    const res = await onComfirm();
    if (res && res.status !== ERROR_CODE) {
      setMessage(prev => ({...prev, status: EMessage.MESSAGE_IN_PROGRESS}));
    }
    setIsVisible(false);
  }, [onComfirm]);

  const handleComplete = useCallback(async () => {
    setIsVisible(true);
    const res = await onComplete();
    if (res && res?.status !== ERROR_CODE) {
      setMessage(prev => ({...prev, status: EMessage.MESSAGE_COMPLETED}));
    }
    setIsVisible(false);
  }, [onComplete]);

  return (
    <Pressable style={styles.container} onLongPress={handleLongPress}>
      <View>
        <View style={styles.row}>
          <CustomText text="Type: " type="text_medium_18" color="black" />
          <CustomText text={message.type} type="text_medium_18" color="blue" />
        </View>

        {message.description && (
          <View style={styles.row}>
            <CustomText
              text="Description: "
              type="text_medium_18"
              color="black"
            />
            <CustomText
              text={message.description}
              type="text_medium_18"
              color="blue"
            />
          </View>
        )}

        <View style={styles.row}>
          <CustomText text="Location: " type="text_medium_18" color="black" />
          <CustomText
            text={message.location?.description?.more}
            type="text_medium_18"
            color="blue"
          />
          <CustomButton
            icon={ToLocationIcon}
            type="secondary"
            iconSize={styles.locationIcon}
            onPress={handleGoMap}
          />
        </View>

        {currentUser?.uid !== message.userId && (
          <View style={styles.actions}>
            <CustomButton
              label="Comfirm"
              type="notify"
              disabled={
                message.status !== EMessage.MESSAGE_PENDING || isVisible
              }
              onPress={handleComfirm}
            />
            <CustomButton
              label="Complete"
              type="notify"
              disabled={
                message.status === EMessage.MESSAGE_COMPLETED ||
                message.status === EMessage.MESSAGE_PENDING ||
                isVisible
              }
              onPress={handleComplete}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default memo(MessageInfo);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: WHITE_COLOR,
    alignSelf: 'flex-start',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 12,
    alignItems: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 5,
  },
  locationIcon: {
    width: 40,
    height: 40,
  },
});
