import {storiesOf} from '@storybook/react-native';
import CustomButton from '.';
import React from 'react';
import {action} from '@storybook/addon-actions';

storiesOf('Button', module).add('default', () => (
  <CustomButton label="123" onPress={action('Button Press')} />
));
