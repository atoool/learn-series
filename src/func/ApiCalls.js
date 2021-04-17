import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {isEqual} from 'lodash';
import R from '../res/R';

export const fetchData = async type => {
  let data = null;
  let newData = null;
  const json = await AsyncStorage.multiGet([type, 'lang']).catch(e => {});
  if (json[0][1]) {
    data = JSON.parse(json[0][1]);
  }
  if (data == null) {
    newData = await Axios.get(
      `${R.strings.api}${type}&appname=${R.strings.bundleId}${
        json[1][1] === 'en' ? '' : `_${json[1][1]}`
      }`,
    ).catch(e => {});
    data = newData.data;
    await AsyncStorage.setItem(type, JSON.stringify(newData.data)).catch(
      e => {},
    );
  } else {
    setTimeout(async () => {
      newData = await Axios.get(
        `${R.strings.api}${type}&appname=${R.strings.bundleId}${
          json[1][1] === 'en' ? '' : `_${json[1][1]}`
        }`,
      ).catch(e => {});
      if (newData?.data && !isEqual(data, newData?.data)) {
        data = newData?.data;
        await AsyncStorage.setItem(type, JSON.stringify(newData?.data)).catch(
          e => {},
        );
      }
    }, 200);
  }
  return data;
};
