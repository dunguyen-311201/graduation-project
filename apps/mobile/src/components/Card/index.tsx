import {
  Image,
  StyleSheet,
  Pressable,
  View,
  ImageSourcePropType,
} from 'react-native';
import React, {memo} from 'react';

import {CustomText} from '../common';
import {colors as themeColors, themedStyles} from '../../theme/tokens';

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

const styles = themedStyles(() => StyleSheet.create({
  card: {
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: themeColors.surfaceRaised,
    borderRadius: 5,

    shadowColor: themeColors.primary,
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
}));
