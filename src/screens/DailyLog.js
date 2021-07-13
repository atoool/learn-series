import React from 'react';
import WebView from 'react-native-webview';
import {Signup} from '../func/FirebaseAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ContextStates} from '../func/ContextStates';
import {StyleSheet} from 'react-native';

export default class DailyLog extends React.PureComponent {
  static contextType = ContextStates;
  responses = async url => {
    if (url.indexOf('/signUpFbase/') > -1) {
      let u = url.substring(url.indexOf('%'));
      let dec = decodeURI(u);
      let j = JSON.parse(dec);
      let success = await Signup(j.email, j.pwd);
      success
        ? this.webview.injectJavaScript(
            `javascript:signUpCallback('${true}','')`,
          )
        : this.webview.injectJavaScript(
            `javascript:signUpCallback('${false}','')`,
          );
      await AsyncStorage.setItem('username', j.username).catch(e => {});
      return false;
    } else if (url.indexOf('/goback') > -1) {
      this.props.navigation.goBack();
      return false;
    }
  };
  render() {
    const {lang} = this.context.reduState;
    return (
      <>
        <WebView
          ref={r => (this.webview = r)}
          style={styles.webview}
          source={{
            uri: `file:///android_asset/onboarding/dailyLog.html?lang=${lang}&appname=keto.weightloss.diet.plan`,
          }}
          onShouldStartLoadWithRequest={res => {
            if (res.url.indexOf('/tech') > -1) {
              return false;
            }
            this.responses(res.url);
            return true;
          }}
        />
      </>
    );
  }
}
const styles = StyleSheet.create({
  webview: {flex: 1},
});
