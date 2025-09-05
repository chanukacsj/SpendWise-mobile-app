import { Platform, View, Dimensions, StatusBar } from 'react-native';
import React from 'react';
import { ScreenWrapperProps } from '@/type';

const { height } = Dimensions.get('window');

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
let paddingTop = Platform.OS === 'ios' ? height * 0.04 : StatusBar.currentHeight || 0;

  return (
    <View 
      style={[{ paddingTop }, style]} 
      className="flex-1 bg-[#171717]"
    >
      <StatusBar barStyle="light-content" />
      {children}
    </View>
  );
};

export default ScreenWrapper;
