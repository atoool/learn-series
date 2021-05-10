import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import R from '../res/R';

const key = 'appData';
export const api = async lang => {
  const data = await Axios.get(R.strings.api).catch(e => {});
  await AsyncStorage.setItem(key, JSON.stringify(data.data)).catch(e => {});
  return data.data;
};

export const fetchData = async lang => {
  let data = null;
  const json = await AsyncStorage.getItem(key).catch(e => {});
  if (json) {
    data = JSON.parse(json);
    setTimeout(async () => {
      await api(lang);
    }, 100);
    return data;
  } else {
    return await api(lang);
  }
};
