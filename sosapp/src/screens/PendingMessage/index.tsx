import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {EScreen} from '@enums';
import {Location, TMessage} from '@types';
import {RootScreenNavigationProps} from '@navigation';
import {useMessages} from '@hooks';
import {ScreenBase, MessageInfo, CustomText} from '@components';

const PendingMessage = () => {
  const {navigate} =
    useNavigation<RootScreenNavigationProps<EScreen.MESSAGES>>();

  const {messages} = useMessages();

  const goMap = useCallback((location?: Location) => {
    navigate(EScreen.MAP, {to: location});
  }, []);

  const handleNavigateDetail = useCallback((uid: string) => {
    uid && navigate(EScreen.DETAIL_MESSAGE, {uid});
  }, []);

  const renderItem = useCallback(
    ({item}: {item: TMessage}) => (
      <MessageInfo
        data={item}
        onMap={goMap}
        onLongPress={handleNavigateDetail}
      />
    ),
    [handleNavigateDetail],
  );

  const keyExtractor = useCallback((item: TMessage) => item.uid + '', []);

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  return (
    <>
      <ScreenBase padding={10} customStyle={styles.container}>
        <View style={styles.content}>
          {messages?.length > 0 ? (
            <FlatList
              data={messages}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              ItemSeparatorComponent={ItemSeparatorComponent}
            />
          ) : (
            <CustomText
              text="There are currently no requests, scroll to the side tab to see your requests or the ones you've confirmed!"
              type="text_regular_24"
              color="red"
              center
            />
          )}
        </View>
      </ScreenBase>
    </>
  );
};

export default PendingMessage;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  content: {
    flex: 1,
  },
  separator: {
    height: 5,
  },
});
