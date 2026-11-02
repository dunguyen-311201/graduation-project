import {Alert, FlatList, Pressable, StyleSheet, View} from 'react-native';
import {
  EmptyListComponent,
  MessageInfo,
  ScreenBase,
  Txt,
} from '@components';
import React, {useCallback, useContext, useLayoutEffect} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {Context} from '@context';
import {EScreen} from '@enums';
import {RootParamList} from '@navigation/RootNavigation';
import {RootScreenNavigationProps} from '@navigation';
import {TMessage} from '@types';
import {isFreeUser} from '@features/auth';
import {useMessages} from '@features/rescue';
import {colors as themeColors, themedStyles} from '../../theme/tokens';

type ConfirmRoute = RouteProp<RootParamList, EScreen.MESSAGES>;

const Messages = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.MESSAGES>>();
  const route = useRoute<ConfirmRoute>();
  const {workerID, mode} = route.params || {};
  const inTab = route.name !== EScreen.MESSAGES;

  const {currentUser} = useContext(Context);

  const {messages, onDelete, onNew, loading} = useMessages(workerID);

  useLayoutEffect(() => {
    mode && navigate(EScreen.SEND_DISTRESS_SIGNAL, {onNew});
  }, []);

  const handleNavigateDetail = useCallback((id: string) => {
    navigate(EScreen.DETAIL_MESSAGE, {id, onDelete});
  }, []);

  const renderItem = useCallback(({item}: {item: TMessage}) => {
    return <MessageInfo item={item} onPress={handleNavigateDetail} />;
  }, []);

  const keyExtractor = useCallback((item: TMessage) => item.id, []);

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const handleback = useCallback(() => {
    navigate(EScreen.DRAWER);
  }, []);

  const handleSendRescue = useCallback(async () => {
    if (await isFreeUser()) {
      navigate(EScreen.SEND_DISTRESS_SIGNAL, {onNew});
      return;
    }

    Alert.alert(
      'Unable to Add Request',
      'There is already a request in progress. Please wait until the current request is completed.',
      [
        {
          text: 'OK',
          onPress: () => {},
        },
      ],
    );
  }, []);

  return (
    <ScreenBase
      customStyle={styles.container}
      title="Requests"
      onBack={inTab ? undefined : handleback}
      loading={loading}
      flexDirection="row">
      <View style={styles.content}>
        {messages.length > 0 ? (
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemSeparatorComponent}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.content}>
            <EmptyListComponent text="No rescue requests yet" />
          </View>
        )}
        {currentUser?.role === 'user' && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="New rescue request"
            onPress={handleSendRescue}
            style={({pressed}) => [styles.fab, pressed && styles.fabPressed]}>
            <Txt style={styles.fabPlus} color={themeColors.onPrimary}>
              +
            </Txt>
          </Pressable>
        )}
      </View>
    </ScreenBase>
  );
};

export default Messages;

const styles = themedStyles(() => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  // Room under the last card for the floating button.
  list: {paddingBottom: 88},
  separator: {
    height: 12,
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeColors.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  fabPressed: {backgroundColor: themeColors.primaryPressed},
  fabPlus: {fontSize: 30, lineHeight: 34, fontWeight: '400'},
}));
