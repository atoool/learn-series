import AsyncStorage from '@react-native-community/async-storage';
import {fetchData} from './ApiCalls';
import Home from '../screens/Home';
import {Platform} from 'react-native';
import {checkPurchased, showPrice} from '../comp/PremiumCheckFun';
import {GoogleSignin} from '@react-native-community/google-signin';
// import RNFS from 'react-native-fs';

export async function IAPCall() {
  let htmlPath = '';
  let premiumPurchased = false;
  let prices = [0, 0, 0];
  await AsyncStorage.multiGet(['isPremium', 'prices', 'htmlPath'])
    .then(async r => {
      if (Platform.OS === 'ios') {
        // const results = await RNFS.readDir(RNFS.MainBundlePath);
        // const webFolder = results.filter(f => f.name == 'Web.bundle');
        // htmlPath = 'file://' + webFolder[0].path;
      } else htmlPath = 'file:///android_asset/html';

      if (r[0][1] == null || r[1][1] == null) {
        premiumPurchased = await checkPurchased().catch(e => {});

        if (premiumPurchased == false) {
          prices = await showPrice().catch(e => {});
        }
        await AsyncStorage.multiSet([
          ['isPremium', JSON.stringify(premiumPurchased)],
          ['prices', JSON.stringify(prices)],
        ]).catch(e => {});
      } else {
        premiumPurchased = JSON.parse(r[0][1]);

        prices = JSON.parse(r[1][1]);

        let isPremium = await checkPurchased().catch(e => {});
        if (isPremium !== premiumPurchased) premiumPurchased = isPremium;
        let cPrices = await showPrice().catch(e => {});
        // console.warn(prices);
        if (cPrices !== prices) prices = cPrices;
      }
    })
    .catch(e => {});

  return [htmlPath, premiumPurchased, prices];
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
  if (userInfo?.user?.name) return true;
  else false;
}

export async function init(state) {
  const local = await AsyncStorage.multiGet(['session', 'sleepSess']);
  const home = await fetchData('home');
  const explore = await fetchData('explore');
  const sleep = await fetchData('sleep');
  const mainP = local[0][1] ? JSON.parse(local[0][1]) : null;
  const sleepPr = local[1][1] ? JSON.parse(local[1][1]) : null;
  const IAP = await IAPCall();
  const isSignedIn = await onSignedIn();
  let myC = [];
  mainP &&
    mainP.map(
      m => (myC = [...myC, ...explore.plans.filter(t => t.name === m.plan)]),
    );
  const myCourse = myC.length == 0 ? home.mainPlan : myC;
  return {
    ...state,
    session: mainP
      ? mainP
      : [{plan: home.mainPlan[0].name, lesson: 1, chapter: 1}],
    mainPlan: home.mainPlan,
    recomPlan: home.recommended,
    mainVideo: home.mainVideo,
    imgHome: home.images,
    imgSleep: sleep.images,
    imgExplore: explore.images,
    titHome: home.titles,
    titExplore: home.titles,
    titSleep: sleep.titles,
    desc: home.descriptions,
    descHome: home.descriptions,
    descExplore: explore.descriptions,
    descSleep: sleep.descriptions,
    explore: explore.plans,
    videos: [],
    sleep: sleep.plans,
    myCourse,
    sleepPr: sleepPr
      ? sleepPr
      : [{plan: sleep.plans[0].name, lesson: 1, chapter: 1}],
    rateUs: false,
    htmlPath: IAP[0],
    premiumPurchased: IAP[1],
    prices: IAP[2],
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

async function sleepSess(val, state) {
  await AsyncStorage.setItem('sleepSess', JSON.stringify(val)).catch(e => {});
  return {...state, session: val};
}

export async function reducer(state, action) {
  switch (action.type) {
    case 'session':
      return await session(action.payload, state);
    case 'sleepSess':
      return await sleepSess(action.payload, state);
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
