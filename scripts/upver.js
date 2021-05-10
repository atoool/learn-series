const replace = require('replace-in-file');
const packageObject = require('../package.json');

const versionRegEx = new RegExp(/\d+\.\d+\.\d+/, 'g');
const buildRegEx = new RegExp(/\d+/, 'g');

const {argv} = process;

const argsValid = () => {
  //Validate Arguments Length
  if (argv.length === 4) {
    //Validate Version Number
    if (versionRegEx.test(argv[2])) {
      //Validate Build Number
      if (buildRegEx.test(argv[3])) {
        return true;
      } else {
        console.log('Invalid Build Number');
      }
    } else {
      console.log('Invalid Version Number');
    }
  } else {
    console.log('Invalid number of arguments, eg: yarn run upver 4.7.96 24');
  }
  return false;
};

const updatePackage = (currentVersion, newVersion, currentBuild, newBuild) => {
  const files = './package.json';

  const fromString1 = `"version": "${currentVersion}"`;
  const from1 = new RegExp(fromString1, 'g');
  const fromString2 = `"buildNumber": ${currentBuild}`;
  const from2 = new RegExp(fromString2, 'g');

  const to1 = `"version": "${newVersion}"`;
  const to2 = `"buildNumber": ${newBuild}`;
  console.warn(to2);
  const from = [from1, from2];
  const to = [to1, to2];

  const options = {
    files,
    from,
    to,
  };

  replace(options)
    .then(() => console.log('📦 package.json ✅'))
    .catch(() => console.log('🛑 Error Updating 📦 package.json'));
};

const updateAndroid = (currentVersion, newVersion, currentBuild, newBuild) => {
  const files = './android/app/build.gradle';

  const fromString1 = `versionName "${currentVersion}"`;
  const from1 = new RegExp(fromString1, 'g');
  const fromString2 = `versionCode ${currentBuild}`;
  const from2 = new RegExp(fromString2, 'g');

  const to1 = `versionName "${newVersion}"`;
  const to2 = `versionCode ${newBuild}`;

  const from = [from1, from2];
  const to = [to1, to2];

  const options = {
    files,
    from,
    to,
  };

  replace(options)
    .then(() => console.log('🤖 Android ✅'))
    .catch(() => console.log('🛑 Error Updating 🤖 Android => build.gradle'));
};

if (argsValid()) {
  const currentVersion = packageObject.version;
  const currentBuild = packageObject.buildNumber;
  const newVersion = argv[2];
  const newBuild = argv[3];

  console.log(
    `\n🚀 v${currentVersion}-${currentBuild} 🔜 v${newVersion}-${newBuild} 🚀\n`,
  );
  //Update Package.json
  updatePackage(currentVersion, newVersion, currentBuild, newBuild);
  //Update Android
  updateAndroid(currentVersion, newVersion, currentBuild, newBuild);
}
