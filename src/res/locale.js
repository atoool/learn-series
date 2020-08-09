import LocalizedStrings from 'react-native-localization';

// const jsonLang = require('./fasting.json');

let locale = new LocalizedStrings({
  en: {
    appName: 'Fasting Tracker',
    shareSub: 'Download Fasting Tracker app',
    shareMessage1: 'Best Fasting Tracker app for body fasting',
    shareMessage2: 'Take a look at "Fasting Tracker" app',
    launchText: 'Start fasting on your health',
    fastNotifyTitle0: 'Get ready to feel amazing!',
    fastNotifyTitle1: '3..2..1.. Action!!!! ',
    fastNotifyTitle2: 'Tik-tok… Tik-tok…',
    fastNotifyTitle3: 'You are amazing!!! ',
    fastNotify0: "One more hour and then it's ‘fasting time’ for you!",
    fastNotify1: 'Your fasting begins now!',
    fastNotify2: 'One more hour left for your fast to end.',
    fastNotify3: 'Congratulations on completing an eventful fast!',
    waterNotifyTitle0: 'Water time!',
    waterNotifyTitle1: 'Hydration is Key!',
    waterNotifyTitle2: 'Drink up now!',
    waterNotifyTitle3: 'Water keeps you fresh and healthy!',
    waterNotify0: 'Hydrate yourself by drinking some water now!',
    waterNotify1: "It's time for you to drink one glass of water!",
    waterNotify2: "It's time for water now!",
    waterNotify3: 'How many glasses of water are you down on?',
    ntfyTitle0: '\uD83D\uDE03 Track your progress.',
    ntfyTitle1: '\uD83D\uDCAA\uD83C\uDFFC Punch TODAY in the face!',
    ntfyTitle2: "You're doing great! \uD83D\uDE03\uD83D\uDC4D\uD83C\uDFFC ",
    ntfySub0: 'Healthy Fasting for weight loss\uD83D\uDCAA',
    ntfySub1: 'Take a 15 min walk to refresh your mind \uD83D\uDC4C',
    ntfySub2: '\uD83D\uDD25 Keep walking to lose weight fast.',
    noFastingTitle: 'Begin your fasting week now!',
    noFastingSub:
      "Don't feel like cooking? Skip it and start your fasting week now!",
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
    share: 'SHARE',
    walk: 'Walk',
    oSteps: 'of 6,000 steps',
    steps: 'Steps',
    yAvg: 'You averaged',
    yAvg2: 'steps',
    yAvg3: 'a day over the last 7 days.',
    avgs: 'Average Steps',
    track: 'Your Track',
    waterTrack: 'Water track',
    avgsWater: 'Average water amount',
    waterIntake: 'Total Water Intake',
    cancel: 'CANCEL',
    drink: 'DRINK',
    packages: {tags: ['Weightloss', 'Health']},
    evaluateScreen: {
      difficulty: [
        'Too easy',
        'Very easy',
        'Easy',
        'Okay',
        'Difficult',
        'Very difficult',
        'Too difficult',
      ],
      abortTitle: 'Never mind!',
      abortTxt:
        'You aborted your plan. Did it not meet your expectation? or did it clash with your busy schedule? Whatever the reason, keep track of your goals, start a week or let yourself be motivated and try again.',
      weekTitle: 'How hard/easy did you find this week ?',
      fastTitle: 'How did you like the fasting plan?',
      easy: 'Easy',
      hard: 'Hard',
    },
    continue: 'CONTINUE',
    ok: 'Ok',
    evaluateScreen2: {
      title: 'About you',
      sub1: 'Your weight',
      sub2: 'Your notes',
      sub1Txt: "What's your weight?",
      sub2Txt: 'How was your week?',
      tweight: 'Your weight today',
    },
    FastScreen: {
      now: ['Fasting', 'Eating'],
      remain: 'Remaining',
      EOFasting: 'End of fasting period',
      NFasting: 'Next fasting period',
      FAdjust: 'Adjust fasting period',
      abort: 'ABORT',
      abortAlert: 'Do you really wish to abort ?',
      SFasting: 'Start fasting today',
      CPlan: 'CHOOSE A PLAN',
    },
    HealthScreen: {
      title: 'Health Notice!',
      txt:
        'Dear Fasting Tracker user,\n\nFasting has many health benefits, from increased weight loss to better brain function. But if you have any health issues like diabetes or cardiovascular diseases, please consult a doctor before fasting. You must also take advice from your physician if you are pregnant or breast-feeding. Use Fasting Tracker services at your risk. \n\nThe services and information offered by Fasting Tracker do not constitute medical advice. They are not a substitute for a medical examination or a doctor’s treatment. Minors are allowed to use the app only under the supervision of parents. \n\nWhen you start fasting, your body may show some irregular symptoms. It is because the body requires a little time to adapt to the new lifestyle. Within a few weeks of fasting, you may feel more active and healthy than before.\n\nAll the best!\nYour Fasting Tracker Team',
    },
    initWeek: {
      sAlert1: 'Ready to start a new plan?',
      sAlert2: 'You need to abort the current plan to start a new one',
      sWeek: 'START WEEK',
      fPeriods: 'Fasting Periods',
    },
    PackIntro: {
      title: 'Welcome to the fasting plans!',
      string: [
        {
          title: 'Fasting',
          txt: [
            'Fasting involves restricting your food intake for certain periods of time.',
          ],
        },
        {
          title: 'A Very Powerful Weight Loss Tool',
          txt: [
            'By helping you eat fewer and burn more calories, intermittent fasting causes weight loss by changing both sides of the calorie equation. Studies show that intermittent fasting can be a very powerful weight loss tool.',
          ],
        },
        {
          title: 'What should I drink ?',
          txt: [
            'You can drink water during this period. Unsweetened tea or coffee is also great to have during a fast.',
          ],
        },
        {
          title: 'What are the things I should know before fasting ?',
          txt: [
            'Drink plenty of water or tea during fasting. Keep yourself busy with low-intensity activities, such as walking or meditating. Avoid anything that causes excessive stress during this period. The fasting will help you lose weight or live a healthier, longer life.',
          ],
        },
        {
          title: 'Fasting period:',
          txt: [
            "If one week's fasting period doesn't fit your plans you can change the time frame in the coming week.",
          ],
        },
        {
          title: 'Coach:',
          txt: [
            'Drink plenty of water or tea during fasting. Keep yourself busy with low-intensity activities, such as walking or meditating. Avoid anything that causes excessive stress during this period. The fasting will help you lose weight or live a healthier, longer life.',
            'Reach your goals faster with the Fasting Tracker Coach. It will provide a plan each week along with some weekly challenges. The coach tracks your progress and guides you to achieve your goal. It helps you lose weight, get fitter and healthier in less time. ',
          ],
        },
        {
          title: 'What happens during a Fast:',
          txt: [
            'When you fast, human growth hormone levels go up and insulin levels go down. Your body’s cells also change the expression of genes and initiate important cellular repair processes.',
          ],
        },
      ],
    },
    profile: {
      weight: 'Weight',
      lost: 'You lost',
      goal: 'Goal',
      cWeight: 'Current Weight',
      gWeight: 'Goal Weight',
      FOverall: 'Fasted overall',
      water: 'Water',
      timeline: 'Your timeline',
      diff: 'Difficulty',
      bmi: 'BMI',
      fastedTxt: 'The total amount of hours you have fasted so far.',
      bmiTxt:
        'The Body Mass Index is calculated from your height and weight. Between 19 and 25 you are in normal weight.',
    },
    tutorial: {
      data: [
        {
          title: 'What is intermittent fasting ?',
          txt:
            'It is a diet program, that includes brief cycles of fasting and eating. Sometimes you skip a few meals or fast for an entire day.',
        },
        {
          title: 'Benefits of intermittent fasting',
          txt:
            'Intermittent fasting can strengthen your body. It can help you to lose weight and fat. Many studies have shown that fasting could detoxify the body and improve the immune system. You will feel energetic and can work with better clarity of mind. ',
        },
        {
          title: 'Can I drink while fasting ?',
          txt:
            'Yes, you can drink while fasting. You can drink water, tea, coffee and other zero-calorie drinks while fasting. Drinking can help you to feel less hungry while fasting. You can eat whatever you want during eating hours. ',
        },
        {
          title: 'How does the intermittent fasting coach work?',
          txt:
            'Our fasting coach creates personalized intermittent fasting programs every week that is perfect for you. You could also choose predefined plans or customize existing packs for your taste.',
        },
        {
          title: 'What are the weekly challenges and milestones?',
          txt:
            'These are simple tasks and workouts that can help you in achieving health goals. Each milestone motivates and lets you complete the fitness journey quickly. ',
        },
      ],
      button: "LET'S GO",
    },
    waterScreen: {
      congrats: [
        'Drink some water',
        'Good start',
        'Keep going',
        'Doing great',
        'Almost there',
        'Goal achieved',
      ],
      waterNotific: 'Water Notification',
      on: 'Turn On',
      off: 'Turn Off',
      silent: 'Silent',
      min90: 'Every 90 min',
      hour3: 'Every 3 hour',
    },
    nav: {
      packages: 'PLANS',
      packIntro: 'How It Works',
      initWeek: 'Week Plan',
      evaluate: 'Evaluation',
      walk: 'YOUR TRACK',
    },
    bottomBar: {
      plans: 'Plans',
      me: 'Me',
      fast: 'Fasting',
      settings: 'Settings',
    },
  },
});
// console.warn(jsonLang);

// locale.setContent(jsonLang);

export {locale};
