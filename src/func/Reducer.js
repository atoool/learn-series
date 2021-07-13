import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchData} from './ApiCalls';
import {Platform} from 'react-native';
import {checkPurchased, showPrice} from '../comp/PremiumCheckFun';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {locale} from '../res/locale';

export function getRandomArray(orgArray) {
  var arr = [];
  while (arr.length < 4) {
    var r = Math.floor(Math.random() * orgArray.length);
    arr.push(orgArray[r]);
  }
  return arr;
}

export async function IAPCall() {
  let htmlPath = '';
  let premiumPurchased = false;
  let prices = [0, 0, 0];
  let lang = 'en';
  await AsyncStorage.getItem('lang')
    .then(async r => {
      if (Platform.OS === 'ios') {
        // const results = await RNFS.readDir(RNFS.MainBundlePath);
        // const webFolder = results.filter(f => f.name == 'Web.bundle');
        // htmlPath = 'file://' + webFolder[0].path;
      } else {
        htmlPath = 'file:///android_asset/html';
      }

      premiumPurchased = await checkPurchased().catch(e => {});

      prices = await showPrice().catch(e => {});
      lang = r ? r : 'en';
    })
    .catch(e => {});
  locale.setLanguage(lang);
  return [htmlPath, premiumPurchased, prices, lang];
}

export const reduState = {
  mainPlan: null,
  recomPlan: null,
  mainVideo: null,
  session: [{plan: '', lesson: 1, chapter: 1}],
  explore: null,
  videos: [],
  desc: [],
  sleep: null,
  myCourse: [],
  rateUs: false,
};

export async function onSignedIn() {
  const userInfo = await GoogleSignin.getCurrentUser();
  return userInfo?.user?.name ? true : false;
}

export async function init(state) {
  const IAP = await IAPCall();
  const local = await AsyncStorage.multiGet(['session', 'sleepSess']);
  const data = await fetchData(IAP[3]);
  const home = data?.home;
  const explore = home;
  const mainP = local[0][1] ? JSON.parse(local[0][1]) : null;

  const isSignedIn = await onSignedIn();
  let myC = [];
  mainP &&
    mainP.map(
      m => (myC = [...myC, ...explore?.plans?.filter(t => t.name === m.plan)]),
    );

  const mainPlan = [home?.plans[0]];
  const myCourse = myC.length === 0 ? mainPlan : myC;
  const recomPlan = getRandomArray(explore.plans);
  const mainVideo = home?.heroes.map(o => o?.chapters[0]);
  return {
    ...state,
    session: mainP ? mainP : [{plan: mainPlan[0].name, lesson: 1, chapter: 1}],
    mainPlan,
    recomPlan,
    mainVideo,
    explore: explore?.plans,
    videos: [],
    myCourse,
    rateUs: false,
    htmlPath: IAP[0],
    premiumPurchased: IAP[1],
    prices: IAP[2],
    lang: IAP[3],
    isSignedIn,
  };
}

async function session(val, state) {
  await AsyncStorage.setItem('session', JSON.stringify(val)).catch(e => {});
  let myCourse = [];
  val.map(
    m =>
      (myCourse = [
        ...myCourse,
        ...state.explore.filter(t => t.name === m.plan),
      ]),
  );

  return {...state, myCourse, session: val};
}

export async function reducer(state, action) {
  switch (action.type) {
    case 'session':
      return await session(action.payload, state);
    case 'videos':
      return {...state, videos: action.payload};
    case 'rateus':
      return {...state, rateUs: action.payload};
    case 'signIn':
      return {...state, isSignedIn: action.payload};
    case 'init':
      return action.payload;
    default:
      throw new Error();
  }
}
