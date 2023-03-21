import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootScreenNavigationProps} from '../../navigation/RootNavigation';
import {SCREEN} from '../../enums';
import LinearGradient from 'react-native-linear-gradient';
import {CustomLinearGradient} from '../../components';
import {ArrowRight} from '../../themes';

const SlashScreen = () => {
  const {navigate, setOptions} =
    useNavigation<RootScreenNavigationProps<SCREEN.SLASH_SCREEN>>();

  useEffect(() => {
    setOptions({
      headerShown: false,
    });
  }, [setOptions]);

  const handleNavigateToHome = useCallback(() => {
    navigate(SCREEN.HOME_SCREEN);
  }, [navigate]);

  return (
    <CustomLinearGradient flex={1} customStyle={styles.container}>
      <CustomLinearGradient customStyle={[styles.box, styles.shadow1]}>
        <CustomLinearGradient customStyle={[styles.box, styles.shadow2]}>
          <Text style={styles.boxText}>SOS</Text>
        </CustomLinearGradient>
      </CustomLinearGradient>
      <CustomLinearGradient borderRadius={10} customStyle={styles.button}>
        <Text style={styles.textButton}>Get Started</Text>
        <Image source={ArrowRight} style={styles.arrowIcon} />
      </CustomLinearGradient>
    </CustomLinearGradient>
  );
};

export default SlashScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingTop: 284,
    paddingHorizontal: 36,
    paddingBottom: 62,
  },
  box: {
    width: 181,
    height: 181,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  shadow1: {
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowColor: '#000',
    shadowOpacity: 0.25,
  },
  shadow2: {
    elevation: 2,
    shadowOffset: {
      height: -4,
      width: -4,
    },
    shadowRadius: 10,
    shadowColor: '#BDBDBD',
    shadowOpacity: 0.4,
  },
  boxText: {
    color: '#FFFFFF',
    fontFamily: 'Open Sans',
    fontWeight: '600',
    fontSize: 64,
  },
  button: {
    paddingVertical: 16,
    width: '100%',
    flexDirection: 'row',
  },
  textButton: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
  },
  arrowIcon: {
    marginLeft: 38,
  },
});
