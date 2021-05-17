import LocalizedStrings from 'react-native-localization';

// const jsonLang = require('./fasting.json');

let locale = new LocalizedStrings({
  en: {
    appName: 'Learn Piano Lessons',
    shareSub: 'Download Learn Piano Lessons app',
    shareMessage1: 'Best Learn Piano Lessons app for body fasting',
    shareMessage2: 'Take a look at "Learn Piano Lessons" app',
    launchText: 'Start learning piano lessons',
    getPremium1: 'Get premium',
    getPremium2: 'Premium member',
    premium: 'PREMIUM',
    Notification: 'Notifications',
    scp: 'Change preferences',
    spp: 'Privacy policy',
    stu: 'Terms of use',
    stf: 'Tell a friend',
    lang: 'Language',
    rate: 'Rate us',
    sPAlert: 'You are already a premium member',
    more: 'More apps from Riafy',
    no: 'No',
    yes: 'Yes',
    off: 'OFF',
    on: 'ON',
    network: 'Check your network connection please',
    cancel: 'CANCEL',
    continue: 'CONTINUE',
    ok: 'Ok',
    signin: 'Sign In / Sign Up',
    logout: 'Logout',
    ready: 'Ready?',
    caption: 'Keep learning piano lessons',
    myCourse: 'My courses',
    recom: 'Recommended for you',
    watch: 'WATCH',
    related: 'Related',
    start: 'START',
    search: 'Search courses',
    morning: 'Good Morning',
    afternoon: 'Good Afternoon',
    evening: 'Good Evening',
    night: 'Good Night',
    story: 'Create Story',
    journal1: 'How do you feel today?',
    journal3: 'Track your progress',
    journal2: 'Your achievements',
    home: 'Home',
    explore: 'Explore',
    journal: 'Journal',
    settings: 'Settings',
    error: 'Something went wrong! try again later',
    lessons: 'LESSONS',
    notific: 'Hey! Its time for you to continue your lessons',
  },
});
// console.warn(jsonLang);

// locale.setContent(jsonLang);

export {locale};
