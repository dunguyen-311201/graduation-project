import React from 'react';
import {StyleSheet, Image} from 'react-native';

import {ActiveIcon} from '@theme';

const Active = () => {
  return <Image source={ActiveIcon} style={styles.icon} resizeMode="cover" />;
};

export default Active;

const styles = StyleSheet.create({icon: {}});
