import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import R from '../res/R';

export const api = async (type, lang) => {
  const data = await Axios.get(
    `${R.strings.api}${type}&appname=${R.strings.bundleId}${
      !lang || lang === 'en' ? '' : `_${lang}`
    }`,
  ).catch(e => {});
  await AsyncStorage.setItem(type, JSON.stringify(data.data)).catch(e => {});
  return data.data;
};

export const fetchData = async (type, lang) => {
  let data = null;
  const json = await AsyncStorage.getItem(type).catch(e => {});
  if (json) {
    data = JSON.parse(json);
    setTimeout(async () => {
      await api(type, lang);
    }, 100);
    return data;
  } else {
    return await api(type, lang);
  }
};
