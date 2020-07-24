// import firebase from 'react-native-firebase';
// import {AppState} from 'react-native';
// import R from '../res/R';
// // Build a channel
// const channel1 = new firebase.notifications.Android.Channel(
//   'test-channel1',
//   'Test Channel1',
//   firebase.notifications.Android.Importance.Max,
// ).setDescription('My apps test channel1');

// const channel2 = new firebase.notifications.Android.Channel(
//   'test-channel2',
//   'Test Channel2',
//   firebase.notifications.Android.Importance.Max,
// ).setDescription('My apps test channel2');

// const channel3 = new firebase.notifications.Android.Channel(
//   'test-channel3',
//   'Test Channel3',
//   firebase.notifications.Android.Importance.Max,
// ).setDescription('My apps test channel3');

// // Create the channel
// async function createChannel() {
//   await firebase
//     .notifications()
//     .android.createChannels([channel1, channel2, channel3])
//     .then(() => {
//       // console.warn('channel1');
//     })
//     .catch(err => {
//       // console.warn(err);
//     });
// }

// const notification1 = new firebase.notifications.Notification()
//   .setNotificationId('123')
//   .setTitle(R.locale.appName)
//   .setBody(R.locale.notifiy)
//   .setSound('default')
//   .android.setChannelId('test-channel1')
//   .android.setSmallIcon('ic_launcher');

// async function notification2PushNow(text) {
//   const notification2 = new firebase.notifications.Notification()
//     .setNotificationId('124')
//     .setTitle(R.locale.appName)
//     .setBody(text)
//     .setSound('default')
//     .android.setChannelId('test-channel2')
//     .android.setSmallIcon('ic_launcher');
//   AppState.currentState === 'background' &&
//     (await firebase.notifications().displayNotification(notification2));
// }
// const notification3 = new firebase.notifications.Notification()
//   .setNotificationId('125')
//   .setTitle(R.locale.appName)
//   .setBody(R.locale.notifiy)
//   .setSound('default')
//   .android.setChannelId('test-channel1')
//   .android.setSmallIcon('ic_launcher');
// const notification4 = new firebase.notifications.Notification()
//   .setNotificationId('126')
//   .setTitle(R.locale.appName)
//   .setBody(R.locale.notifiy)
//   .setSound('default')
//   .android.setChannelId('test-channel3')
//   .android.setSmallIcon('ic_launcher');

// // await firebase.notifications().displayNotification(notification)

// checkPermission = async (time1, time2, time3) => {
//   // const enabled = await firebase.messaging().hasPermission();
//   // if (enabled) {
//   // We've the permission
//   scheduledTime(time1, time2, time3);
//   //   await firebase.notifications().onNotificationOpened(() => {
//   //     firebase.notifications().cancelNotification('123');
//   //     firebase.notifications().cancelNotification('125');
//   //     firebase.notifications().cancelNotification('126');
//   //   });
//   // } else {
//   // user doesn't have permission
//   //   try {
//   //     await firebase.messaging().requestPermission();
//   //   } catch (error) {
//   //     Alert.alert(
//   //       'Unable to access the Notification permission. Please enable the Notification Permission from the settings',
//   //     );
//   //   }
//   // }
// };

// async function scheduledTime(time1, time2, time3) {
//   try {
//     // await firebase.notifications().displayNotification(notification);
//     await firebase.notifications().scheduleNotification(notification1, {
//       fireDate: time1,
//       repeatInterval: 'day',
//     });
//     await firebase.notifications().scheduleNotification(notification3, {
//       fireDate: time2,
//       repeatInterval: 'day',
//     });
//     await firebase.notifications().scheduleNotification(notification4, {
//       fireDate: time3,
//       repeatInterval: 'day',
//     });
//   } catch {
//     console.warn('scheduling failed');
//   }
// }

// async function cancelNotification() {
//   await firebase.notifications().cancelAllNotifications();
// }

// export default {
//   channel1,
//   channel2,
//   channel3,
//   createChannel,
//   notification1,
//   notification3,
//   scheduledTime,
//   cancelNotification,
//   checkPermission,
//   notification2PushNow,
// };
