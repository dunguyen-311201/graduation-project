import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {colors, themedStyles} from '../../theme/tokens';

// Same colour and mark as the native splash (app.config.ts), so the hand-over
// is invisible when it shows; in development builds the dev launcher hides the
// native splash early.
function SplashScreen() {
  return (
    <View style={styles.container} accessibilityLabel="SOS is starting">
      <Image
        source={require('../../../assets/splash-icon.png')}
        style={styles.mark}
        resizeMode="contain"
      />
    </View>
  );
}

export default memo(SplashScreen);

const styles = themedStyles(() =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      // primary matches the light and dark splash colours in app.config.ts.
      backgroundColor: colors.primary,
    },
    mark: {
      width: 180,
      height: 180,
    },
  }),
);
