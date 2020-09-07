import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {isEqual} from 'lodash';
import R from '../res/R';

export const fetchData = async type => {
  let data = null;
  let newData = null;
  const json = await AsyncStorage.getItem(type).catch(e => {});
  if (json) data = JSON.parse(json);
  if (data == null) {
    newData = await Axios.get(R.strings.api + type).catch(e => {});
    data = newData.data;
    await AsyncStorage.setItem(type, JSON.stringify(newData.data)).catch(
      e => {},
    );
  } else {
    setTimeout(async () => {
      newData = await Axios.get(R.strings.api + type).catch(e => {});
      if (!isEqual(data, newData.data)) {
        data = newData.data;
        await AsyncStorage.setItem(type, JSON.stringify(newData.data)).catch(
          e => {},
        );
      }
    }, 100);
  }
  return data;
};
