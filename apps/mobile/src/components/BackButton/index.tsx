import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {BackIcon} from '@theme';
import {CustomButton} from '../common';
import {colors as themeColors, themedStyles} from '../../theme/tokens';

type Iconprops = {
  onPress?: () => void;
};

const BackButton = ({onPress}: Iconprops) => {
  return (
    <>
      <CustomButton
        icon={BackIcon}
        iconTint={themeColors.text}
        iconSize={{width: 24, height: 24}}
        type="secondary"
        accessibilityLabel="Go back"
        customStyle={styles.button}
        onPress={onPress}
      />
    </>
  );
};

export default memo(BackButton);

const styles = themedStyles(() => StyleSheet.create({
  button: {
    alignSelf: 'center',
  },
}));
