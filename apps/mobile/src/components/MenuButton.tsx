import {Image, Pressable} from 'react-native';

import {MenuIcon} from '@theme';
import React from 'react';

type MenuButtonProps = {
  marginTop?: number;
  onPress: () => void;
};
const MenuButton = ({onPress, marginTop}: MenuButtonProps) => {
  return (
    <Pressable onPress={onPress} style={{marginTop}}>
      <Image source={MenuIcon} />
    </Pressable>
  );
};

export default MenuButton;
