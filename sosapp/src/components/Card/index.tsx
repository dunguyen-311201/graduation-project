import {Image, StyleSheet, Text, Pressable} from 'react-native';
import React, {memo} from 'react';
import {LIGHT_BLUE_COLOR, WHITE_COLOR} from '@theme/color';
import {ImageSourcePropType} from 'react-native';

import {Styles as st} from '@utils';

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
      <Text style={[st.text_medium_light_blue_18, styles.title]}>{title}</Text>
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
    marginRight: 16,
    marginBottom: 16,
    width: '40%',
    shadowColor: LIGHT_BLUE_COLOR,
    shadowOffset: {
      height: -5,
      width: -5,
    },
    shadowRadius: 10,
    shadowOpacity: 0.6,
    elevation: 10,
  },
  icon: {
    width: 80,
    height: 80,
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
  },
});
