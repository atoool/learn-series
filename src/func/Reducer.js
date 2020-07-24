import AsyncStorage from '@react-native-community/async-storage';
import {fetchData} from './ApiCalls';

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
};

export async function init(state) {
  const local = await AsyncStorage.multiGet(['session', 'sleepSess']);
  const home = await fetchData('home');
  const explore = await fetchData('explore');
  const sleep = await fetchData('sleep');
  const mainP = local[0][1] ? JSON.parse(local[0][1]) : null;
  const sleepPr = local[1][1] ? JSON.parse(local[1][1]) : null;
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
    desc: home.descriptions,
    explore: explore.plans,
    videos: [],
    sleep: sleep.plans,
    myCourse,
    sleepPr: sleepPr
      ? sleepPr
      : [{plan: sleep.plans[0].name, lesson: 1, chapter: 1}],
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
        ...state.mainPlan.filter(t => t.name === m.plan),
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
    case 'init':
      return action.payload;
    default:
      throw new Error();
  }
}
