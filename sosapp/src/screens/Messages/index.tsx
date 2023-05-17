import {StyleSheet, FlatList, View} from 'react-native';
import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';

import {
  CustomText,
  Loading,
  MessageInfo,
  Notify,
  ScreenBase,
} from '@components';
import {EScreen} from '@enums';
import {Location, TMessage} from '@types';
import {useMessages, useNotifiCation} from '@hooks';
import {RootScreenNavigationProps} from '@navigation';

const Messages = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.MESSAGES>>();

  const {message, handleQuit, handleOk, body} = useNotifiCation({
    navigate,
  });

  const {messages, loading} = useMessages(1);

  const handleGoMap = useCallback((location: Location) => {
    if (location) {
      navigate(EScreen.MAP, {from: location});
    }
  }, []);

  const handleNavigateDetail = useCallback((uid: string) => {
    navigate(EScreen.DETAIL_MESSAGE, {uid});
  }, []);

  const renderItem = useCallback(({item}: {index: number; item: TMessage}) => {
    return (
      <MessageInfo
        data={item}
        onMap={handleGoMap}
        onLongPress={handleNavigateDetail}
      />
    );
  }, []);

  const keyExtractor = useCallback(
    (item: TMessage, index: number) => item.uid || index + '',
    [],
  );

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <>
      {/* Handle Show Notifications */}

      {message && (
        <Notify
          message={message}
          onOk={handleOk}
          onQuit={handleQuit}
          body={body}
        />
      )}

      {/* Handle Show Notifications */}

      <ScreenBase padding={10} customStyle={styles.container}>
        {loading && <Loading />}
        {messages && messages.length > 0 && (
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemSeparatorComponent}
          />
        )}
        {!messages && <CustomText text="List Message is empty!" />}
      </ScreenBase>
    </>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  separator: {
    height: 10,
  },
});
