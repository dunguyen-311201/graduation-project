// stories/MyButton.stories.tsx
import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import Demo from './index';

export default {
  title: 'components/Test',
  component: Demo,
} as ComponentMeta<typeof Demo>;

export const Basic: ComponentStory<typeof Demo> = () => <Demo />;

Basic.args = {
  text: 'Hello World',
  color: 'purple',
};
