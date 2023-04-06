import {ComponentMeta, ComponentStory} from '@storybook/react-native';
import React from 'react';
import {Text, View} from 'react-native';

import CustomButton from './index';

export default {
  title: 'src/components/common/Button',
  component: CustomButton,
} as ComponentMeta<typeof CustomButton>;

export const Basic: ComponentStory<typeof CustomButton> = args => (
  <CustomButton {...args} />
);

Basic.args = {
  type: 'outline',
  children: (
    <View>
      <Text>Get Started</Text>
    </View>
  ),
};
