import {Text, TextStyle} from 'react-native';
import React, {memo} from 'react';
import {Styles} from '@utils';

type CustomTextProps = {
  text: string;
  children?: React.ReactNode | string;
  type?: keyof typeof Styles;
  customStyle?: TextStyle;
};

const CustomText = ({text, type, children, customStyle}: CustomTextProps) => {
  return (
    <Text style={{...(type && Styles[type]), ...customStyle}}>
      {text}
      {children}
    </Text>
  );
};

export default memo(CustomText);
