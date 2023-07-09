// stories/MyButton.stories.tsx
import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import Back from './index';

export default {
  title: 'src/components/Back',
  component: Back,
} as ComponentMeta<typeof Back>;

export const Basic: ComponentStory<typeof Back> = args => <Back {...args} />;

Basic.args = {};
