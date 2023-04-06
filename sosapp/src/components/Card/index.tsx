import {Image, StyleSheet, Text, Pressable} from 'react-native';
import React, {memo} from 'react';
import {WHITE_COLOR} from '@theme/color';
import {ImageSourcePropType} from 'react-native';

export type CardProps = {
  title: string;
  description?: string;
  icon: ImageSourcePropType;
  onPress: () => void;
};
const Card = ({title, icon, description, onPress}: CardProps) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text>{title}</Text>
      {description && <Text>{description}</Text>}
    </Pressable>
  );
};

export default memo(Card);

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: WHITE_COLOR,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  icon: {
    width: 80,
    height: 80,
  },
});
