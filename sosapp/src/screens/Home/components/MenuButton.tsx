import React from 'react';
import {Pressable, Image} from 'react-native';

import {MenuIcon} from '@theme';

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
