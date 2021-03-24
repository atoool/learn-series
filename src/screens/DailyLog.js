import React from 'react';
import WebView from 'react-native-webview';
import {Signup} from '../func/FirebaseAuth';
import AsyncStorage from '@react-native-community/async-storage';

export default class DailyLog extends React.PureComponent {
  state = {};
  responses = async (url) => {
    if (url.indexOf('/signUpFbase/') > -1) {
      let u = url.substring(url.indexOf('%'));
      let dec = decodeURI(u);
      let j = JSON.parse(dec);
      let success = await Signup(j.email, j.pwd);
      success
        ? this.webview.injectJavaScript(
            "javascript:signUpCallback('" + true + "','')",
          )
        : this.webview.injectJavaScript(
            "javascript:signUpCallback('" + false + "','')",
          );
      await AsyncStorage.setItem('username', j.username).catch((e) => {});
      return false;
    } else if (url.indexOf('/goback') > -1) {
      this.props.navigation.goBack();
      return false;
    }
  };
  render() {
    return (
      <>
        <WebView
          ref={(r) => (this.webview = r)}
          style={{flex: 1}}
          source={{
            uri:
              'file:///android_asset/onboarding/dailyLog.html?lang=en&appname=keto.weightloss.diet.plan',
          }}
          onShouldStartLoadWithRequest={(res) => {
            if (res.url === 'https:///tech/') return false;
            this.responses(res.url);
            return true;
          }}
        />
      </>
    );
  }
}
