import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {
  CustomButton,
  EmptyListComponent,
  MessageInfo,
  ScreenBase,
} from '@components';
import React, {useCallback, useContext, useLayoutEffect} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {Context} from '@context';
import {EScreen} from '@enums';
import {NewIcon} from '@theme';
import {RootParamList} from '@navigation/RootNavigation';
import {RootScreenNavigationProps} from '@navigation';
import {TMessage} from '@types';
import {isFreeUser} from '@utils';
import {useMessages} from '@hooks';

type ConfirmRoute = RouteProp<RootParamList, EScreen.MESSAGES>;

const Messages = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.MESSAGES>>();
  const {workerID, mode} = useRoute<ConfirmRoute>().params || {};

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
      onBack={handleback}
      loading={loading}
      padding={20}
      flexDirection="row">
      <View style={styles.content}>
        {messages.length > 0 ? (
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemSeparatorComponent}
          />
        ) : (
          <View style={styles.content}>
            <EmptyListComponent />
          </View>
        )}
        {currentUser?.role === 'user' && (
          <CustomButton
            icon={NewIcon}
            type="secondary"
            customStyle={styles.btnNew}
            onPress={handleSendRescue}
          />
        )}
      </View>
    </ScreenBase>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  separator: {
    height: 2,
  },
  btnNew: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
});
