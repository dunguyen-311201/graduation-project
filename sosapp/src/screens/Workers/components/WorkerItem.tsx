import {
  Image,
  StyleSheet,
  View,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import React, {useCallback, memo} from 'react';

import {TUser} from '@types';
import {CustomButton, CustomText} from '@components';
import {ActiveIcon, UnActiveIcon, WHITE_COLOR} from '@theme';

const WorkerItem = ({
  user,
  icon,
  callback,
}: {
  user: TUser;
  icon?: ImageSourcePropType;
  callback: (id: string) => void;
}) => {
  const handle = useCallback(() => {
    callback(user.id);
  }, []);

  return (
    <Pressable style={[styles.worker, styles.row]}>
      <View style={styles.row}>
        <CustomText
          text={user.displayName || ''}
          color="blue"
          customStyle={styles.name}
        />
        <Image
          source={
            user.status === 'free' && user.lastLogin ? ActiveIcon : UnActiveIcon
          }
        />
      </View>
      <CustomButton icon={icon} type="secondary" onPress={handle} />
    </Pressable>
  );
};

export default memo(WorkerItem);

const styles = StyleSheet.create({
  worker: {
    backgroundColor: WHITE_COLOR,
    padding: 20,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  row: {flexDirection: 'row', alignItems: 'center', columnGap: 10},
  name: {
    textTransform: 'capitalize',
  },
});
