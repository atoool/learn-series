import {Platform} from 'react-native';

const bundleId = 'academy.learn.piano';
const tempBundleId = 'com.rstream.piano';
const defaultImg = require('./imgs/settings.png');
let strings = {
  primary: '',
  bundleId,
  defaultImg,
  rateURL:
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/in/app/fasting-tracker-intermittent/id1514726105'
      : `https://play.google.com/store/apps/details?id=${bundleId}`,
  api: `https://forking.riafy.in/app-console/get-learn-series-api.php?page=home&type=home&appname=${tempBundleId}&lang=`,
  langApi:
    'https://forking.riafy.in/app-console/get-languages-api.php?appname=' +
    tempBundleId,
  version: '1.3.52',
};
export default strings;
// jump.rope.workout.counter
// piano.test.category
