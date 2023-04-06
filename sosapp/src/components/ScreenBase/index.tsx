import {StyleSheet, View} from 'react-native';
import React from 'react';
import BackIcon from '../Back';
import {CustomButton, CustomText} from '../common';

type ScreenBaseProps = {
  title?: string;
  desc?: string;
  onBack?: () => void;
  children?: React.ReactNode;
  onNext?: () => void;
};

const ScreenBase = ({
  title,
  onBack,
  children,
  desc,
  onNext,
}: ScreenBaseProps) => {
  return (
    <View style={styles.container}>
      <View>
        <BackIcon onPress={onBack} />
        {title && <CustomText text={title} type="text_medium_30" />}
        {desc && <CustomText text={desc} type="text_medium_24" />}
        {children}
      </View>
      <View>
        {onNext && (
          <CustomButton onPress={onNext} type="default" label="Next" />
        )}
      </View>
    </View>
  );
};

export default ScreenBase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    justifyContent: 'space-between',
    paddingTop: 36,
    paddingHorizontal: 32,
    paddingBottom: 62,
  },
  title: {
    marginTop: 35,
  },
  desc: {
    marginTop: 35,
  },
});
