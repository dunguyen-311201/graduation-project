import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {EScreen} from '@enums';
import {Location, TMessage} from '@types';
import {RootScreenNavigationProps} from '@navigation';
import {useMessages, useNotifiCation} from '@hooks';
import {ScreenBase, MessageInfo, CustomText, Notify} from '@components';

const PendingMessage = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.MESSAGES>>();

  const {message, handleQuit, handleOk, body} = useNotifiCation({
    navigate,
  });
  const {messages} = useMessages();

  const handleGoMap = useCallback((location: Location) => {
    if (location) {
      navigate(EScreen.MAP, {from: location});
    }
  }, []);

  const handleNavigateDetail = useCallback((uid: string) => {
    uid && navigate(EScreen.DETAIL_MESSAGE, {uid});
  }, []);

  const renderItem = useCallback(
    ({item}: {item: TMessage}) => (
      <MessageInfo
        data={item}
        onMap={handleGoMap}
        onLongPress={handleNavigateDetail}
      />
    ),
    [handleGoMap, handleNavigateDetail],
  );

  const keyExtractor = useCallback((item: TMessage) => item.uid + '', []);

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

      <ScreenBase>
        {messages?.length > 0 ? (
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemSeparatorComponent}
          />
        ) : (
          <CustomText
            text="List request is empty!"
            type="text_large_64"
            color="red"
          />
        )}
      </ScreenBase>
    </>
  );
};

export default PendingMessage;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  separator: {
    height: 10,
  },
});
