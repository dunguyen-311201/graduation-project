import React from 'react';
import {StyleSheet, Image} from 'react-native';

import {ActiveIcon} from '@theme';
import {themedStyles} from '../../../theme/tokens';

const Active = () => {
  return <Image source={ActiveIcon} style={styles.icon} resizeMode="cover" />;
};

export default Active;

const styles = themedStyles(() => StyleSheet.create({icon: {}}));
