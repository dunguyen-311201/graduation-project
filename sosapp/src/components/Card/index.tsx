import {Image, StyleSheet, Pressable, View} from 'react-native';
import React, {memo} from 'react';
import {LIGHT_BLUE_COLOR, WHITE_COLOR} from '@theme/color';
import {ImageSourcePropType} from 'react-native';

import {CustomText} from '../common';

export type CardProps = {
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
};

const Card = ({title, icon, onPress}: CardProps) => {
  return (
    <View style={styles.card}>
      <Pressable style={styles.button} onPress={onPress}>
        <Image source={icon} style={styles.icon} />
      </Pressable>
      <CustomText
        text={title}
        customStyle={styles.title}
        type="text_medium_18"
      />
    </View>
  );
};

export default memo(Card);

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: WHITE_COLOR,
    borderRadius: 5,

    shadowColor: LIGHT_BLUE_COLOR,
    shadowOffset: {
      height: -5,
      width: -5,
    },
    shadowRadius: 5,
    shadowOpacity: 0.6,
    elevation: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
  },
});
