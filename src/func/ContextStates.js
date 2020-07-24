import React from 'react';
import {DefaultTheme} from '@react-navigation/native';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
    card: '#131953',
  },
};

const ContextStates = React.createContext({
  appData: null,
  getAppData: async () => {},
  playVideo: () => {},
  reduFun: async () => {},
  reduState: {},
});

export {ContextStates, MyTheme};
