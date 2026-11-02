import {Image, Pressable, StyleSheet, View} from 'react-native';
import AppButton from '../ui/AppButton';
import Txt from '../ui/Txt';
import {colors, radius, space} from '../../theme/tokens';
import React, {useCallback, useContext} from 'react';

import CloseButton from '../CloseButton';
import {Context} from '@context';
import {ERole} from '@enums';
import {TNotification} from '@types';
import {formatTimeAgo} from '@utils';
import {themedStyles} from '../../theme/tokens';

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

  const isTaskOffer =
    onClose &&
    currentUser?.role === ERole.WORKER &&
    notify.title !== 'NOTIFICATION';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={onClose ? 'Opens the request' : 'Shows actions'}
      onPress={handlePress}
      style={({pressed}) => [
        styles.container,
        onClose && styles.toast,
        pressed && styles.pressed,
      ]}>
      <View style={styles.content}>
        {notify.imageUrl ? (
          <Image source={{uri: notify.imageUrl}} style={styles.image} />
        ) : (
          <View style={styles.dot} />
        )}
        <View style={styles.describe}>
          <Txt variant="label">{notify.title}</Txt>
          <Txt variant="body" color={colors.textMuted}>
            {notify.body}
          </Txt>
          {notify.time ? (
            <Txt variant="caption" color={colors.textMuted}>
              {formatTimeAgo(notify.time)}
            </Txt>
          ) : null}
        </View>
        {onClose && <CloseButton top={4} right={4} onPress={onClose} />}
      </View>

      {isTaskOffer && (
        <View style={styles.actions}>
          <AppButton label="View" onPress={handlePress} style={styles.flex} />
          <AppButton
            label="Deny"
            variant="secondary"
            onPress={onReject}
            style={styles.flex}
          />
        </View>
      )}
    </Pressable>
  );
};

export default Notify;

const styles = themedStyles(() => StyleSheet.create({
  container: {
    padding: space.lg,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  toast: {backgroundColor: colors.surfaceRaised, elevation: 8},
  pressed: {backgroundColor: colors.surfaceRaised},
  content: {flexDirection: 'row', columnGap: space.md},
  describe: {flex: 1, rowGap: 2},
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    backgroundColor: colors.primary,
  },
  image: {borderRadius: 20, width: 40, height: 40},
  actions: {flexDirection: 'row', columnGap: space.sm, marginTop: space.md},
  flex: {flex: 1},
}));
