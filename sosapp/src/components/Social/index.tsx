import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import React from 'react';
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
      <Image source={icon} />
      <CustomText
        text={title}
        type="text_medium_gray_24"
        customStyle={styles.title}
      />
    </Pressable>
  );
};

export default Social;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 44,
  },
});
