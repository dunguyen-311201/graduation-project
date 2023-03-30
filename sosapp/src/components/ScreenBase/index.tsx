import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BackIcon, CustomButton, CustomText} from '@components';

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
        {title && (
          <CustomText
            text={title}
            style={['fs72', 'fw5']}
            customStyle={styles.title}
          />
        )}
        {desc && <CustomText text={desc} style={['fs6', 'fw4']} />}
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
  },
  title: {
    marginTop: 35,
  },
});
