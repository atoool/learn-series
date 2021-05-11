import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import R from '../res/R';

const key = 'appData';
export const api = async lang => {
  console.warn(lang);
  const result = await Axios.get(R.strings.api + lang).catch(e => {});
  const data = result?.data;
  const dt = data?.home?.plans ? data : [];
  await AsyncStorage.setItem(key, JSON.stringify(dt)).catch(e => {});
  return dt;
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
    data = await api(lang);
    return data?.home?.plans ? data : [];
  }
};
