import {Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {BackIcon} from '../../theme';

type Iconprops = {
  onPress?: () => void;
};

const Back = ({onPress}: Iconprops) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={BackIcon} />
    </TouchableOpacity>
  );
};

export default Back;
