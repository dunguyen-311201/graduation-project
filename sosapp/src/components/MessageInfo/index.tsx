import {useNavigation} from '@react-navigation/native';
import {Pressable, StyleSheet, View} from 'react-native';
import React, {memo, useCallback, useContext, useMemo} from 'react';

import {TMessage} from '@types';
import {useUsers} from '@hooks';
import {Context} from '@context';
import {WHITE_COLOR} from '@theme';
import {ActiveIcon, ExpiredIcon, InProgressIcon, PendingIcon} from '../icons';
import {formatTimeAgo} from '@utils';
import {EMessage, ERole, EScreen} from '@enums';
import {MESSAGE_COMPLETED} from '@constants';
import {CustomButton, CustomText} from '../common';
import {RootScreenNavigationProps} from '@navigation';

const MessageInfo = ({
  item,
  onPress,
}: {
  item: TMessage;
  onPress: (uid: string) => void;
}) => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.MESSAGES>>();

  const {currentUser} = useContext(Context);

  const {user} = useUsers(item.workerID);

  const Icon = useMemo(() => {
    if (item.status === EMessage.MESSAGE_PENDING) {
      return <PendingIcon />;
    } else if (item.status === EMessage.MESSAGE_IN_PROGRESS) {
      return <InProgressIcon />;
    } else if (item.status === EMessage.MESSAGE_COMPLETED) {
      return <ActiveIcon />;
    } else {
      return <ExpiredIcon />;
    }
  }, [item]);

  const handleGoMap = useCallback(() => {
    if (currentUser && currentUser.role === ERole.USER && user) {
      user.location && navigate(EScreen.MAP, {to: user.location});
    } else {
      navigate(EScreen.MAP, {to: item.location});
    }
  }, [currentUser, item.location, user]);

  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id]);

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.content}>
        <View style={styles.row}>
          <CustomText text="Type: " type="text_medium_16" color="black" />
          <CustomText text={item.type} type="text_medium_16" color="blue" />
          {Icon}
        </View>

        {item.description && (
          <View style={styles.row}>
            <CustomText
              text="Description: "
              type="text_medium_20"
              color="black"
            />
            <CustomText
              text={item.description}
              type="text_medium_20"
              color="blue"
            />
          </View>
        )}

        <View style={styles.row}>
          <CustomText text="Location: " type="text_medium_16" color="black" />
          <CustomButton type="secondary" onPress={handleGoMap}>
            <CustomText
              text={item.location?.city}
              type="text_medium_16"
              color="blue"
            />
          </CustomButton>
        </View>

        {item.time && (
          <CustomText
            text={
              item.status === MESSAGE_COMPLETED
                ? new Date(item.time).toLocaleString()
                : formatTimeAgo(item.time)
            }
            type="text_medium_14"
            color="black"
          />
        )}
      </View>
    </Pressable>
  );
};

export default memo(MessageInfo);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: WHITE_COLOR,
    alignSelf: 'flex-start',
    borderRadius: 6,
  },
  content: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 6,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    width: '100%',
  },
  locationIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
