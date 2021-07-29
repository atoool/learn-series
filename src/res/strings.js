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
  version: '1.5.63',
  splashApi: `http://riafy.me/splash.php?appname=${bundleId}&country=IN&simcountry=in&version=1.3.2&versioncode=24&network=wifi&loadcount=3&devtype=p&fbclid=IwAR0M6OClxu5DMoJl3efjkEwRSLlJx26JVP9yX8Ywfw70iHDPEWODl1YHUJs`,
};
export default strings;
