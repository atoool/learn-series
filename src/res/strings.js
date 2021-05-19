import {Platform} from 'react-native';

const bundleId = 'academy.learn.piano';
const defaultImg = require('./imgs/settings.png');
let strings = {
  primary: '',
  bundleId,
  defaultImg,
  rateURL:
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/in/app/fasting-tracker-intermittent/id1514726105'
      : `https://play.google.com/store/apps/details?id=${bundleId}`,
  api: `https://forking.riafy.in/app-console/get-learn-series-api.php?page=home&type=home&appname=${bundleId}&lang=`,
  langApi:
    'https://forking.riafy.in/app-console/get-languages-api.php?appname=' +
    bundleId,
  version: '1.3.53',
};
export default strings;
