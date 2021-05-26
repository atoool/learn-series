import AsyncStorage from '@react-native-community/async-storage';

export const setItem = async (key, value, stringify = true) => {
  try {
    stringify && (value = JSON.stringify(value));

    await AsyncStorage.setItem(key, value);
  } catch {}
};
export const getItem = async (key, parse = true) => {
  try {
    let value = await AsyncStorage.getItem(key);
    parse && (value = JSON.parse(value));
    return value;
  } catch {}
  return null;
};
