const bundleId = 'academy.learn.piano';
export default (strings = {
  primary: '',
  bundleId,
  defaultImg: 'http://fstream.in/wellness/Packs/abs%20challenge.jpg',
  rateURL:
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/in/app/fasting-tracker-intermittent/id1514726105'
      : `https://play.google.com/store/apps/details?id=${bundleId}`,
  api: `https://cookbookapp.in/RIA/learningAPI.php?appname=${bundleId}&shrink&type=`,
  version: '1.1.40',
});
// jump.rope.workout.counter
// piano.test.category
