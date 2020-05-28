import React from 'react';
import {DefaultTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
    card: '#131953',
  },
};

const fetchData = async video => {
  let vid = video ? video : '';
  let data;
  await fetch(
    'https://hiit.ria.rocks/videos_api/cdn/com.rstream.mindfulness?versionCode=50' +
      vid,
  )
    .then(r => r.json())
    .then(async res => {
      data = res;
      await AsyncStorage.setItem('appData', JSON.stringify(res)).catch(e => {});
    })
    .catch(e => {});
  return data;
};

const ContextStates = React.createContext({
  loader: false,
  activateLoader: () => {},
  appData: null,
  getAppData: async () => {},
  playVideo: () => {},
});

export {ContextStates, MyTheme, fetchData};
