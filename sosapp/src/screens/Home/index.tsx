import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackScreenNavigationProps} from '@navigation';

import {EScreen} from '@enums';
import {ScreenBase, Card} from '@components';
import {GoMapIcon, SOSIcon} from '@theme/icon';

const HomeScreen = () => {
  const {navigate, setOptions} =
    useNavigation<StackScreenNavigationProps<EScreen.HOME>>();

  useEffect(() => {
    setOptions({headerShown: false});
  }, [setOptions]);

  const _navigationMap = useCallback(() => {
    navigate(EScreen.MAP);
  }, [navigate]);

  const _handleSendRescue = useCallback(() => {
    navigate(EScreen.SEND_DISTRESS_SIGNAL);
  }, [navigate]);

  return (
    <ScreenBase
      title={
        'To find your pickup\nlocation\nautomatically, turn \non location services'
      }
      onOptions={() => {}}>
      <View style={styles.options}>
        <Card icon={SOSIcon} title="Send rescue" onPress={_handleSendRescue} />
        <Card icon={GoMapIcon} title="Go to Map" onPress={_navigationMap} />
        <Card
          icon={SOSIcon}
          title="Emergency rescue"
          onPress={_navigationMap}
        />
      </View>
    </ScreenBase>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
