import React, {memo} from 'react';

import {BackIcon} from '@theme';
import {CustomButton} from '../common';
import {StyleSheet} from 'react-native';

type Iconprops = {
  onPress?: () => void;
};

const BackButton = ({onPress}: Iconprops) => {
  return (
    <CustomButton
      icon={BackIcon}
      type="secondary"
      customStyle={styles.button}
      onPress={onPress}
    />
  );
};

export default memo(BackButton);

const styles = StyleSheet.create({
  button: {
    // alignSelf: 'flex-start',
  },
});
