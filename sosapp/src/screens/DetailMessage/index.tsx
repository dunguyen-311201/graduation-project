import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';

import {EScreen} from '@enums';
import {RootParamList} from '@navigation/RootNavigation';

type ConfirmRoute = RouteProp<RootParamList, EScreen.DETAIL_MESSAGE>;

const DetailMessage = () => {
  const {uid} = useRoute<ConfirmRoute>().params || {};

  return (
    <View>
      <Text>DetailMessage: </Text>
      <Text>{uid} </Text>
    </View>
  );
};

export default DetailMessage;

const styles = StyleSheet.create({});
