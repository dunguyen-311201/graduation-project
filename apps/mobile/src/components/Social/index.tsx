import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React, {memo} from 'react';

import {CustomText} from '../common';

type SocialProps = {
  title: string;
  icon: ImageSourcePropType;
  customStyle?: ViewStyle;
  onPress: () => void;
};

const Social = ({icon, title, customStyle, onPress}: SocialProps) => {
  return (
    <Pressable style={[styles.container, {...customStyle}]} onPress={onPress}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <CustomText
        text={title}
        type="text_medium_20"
        customStyle={styles.title}
      />
    </Pressable>
  );
};

export default memo(Social);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 44,
  },
  icon: {
    width: 40,
    height: 40,
  },
});
