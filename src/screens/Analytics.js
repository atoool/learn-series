import React from 'react';
import WebView from 'react-native-webview';
import {View, StyleSheet} from 'react-native';
import {ContextStates} from '../func/ContextStates';

export default class Analytics extends React.PureComponent {
  static contextType = ContextStates;
  state = {lang: 'en'};

  responses = async url => {
    if (url.indexOf('goback') > -1) {
      this.props.navigation.goBack();
    } else if (url.indexOf('/premium') > -1) {
      this.props.navigation.navigate('Premium');
    }
  };
  render() {
    const {lang} = this.context.reduState;
    return (
      <View style={styles.container}>
        <WebView
          ref={r => (this.webview = r)}
          style={styles.webView}
          source={{
            uri: `file:///android_asset/onboarding/analytics.html?lang=${
              lang ? lang : 'en'
            }&appname=keto.weightloss.diet.plan&data=1`,
          }}
          onShouldStartLoadWithRequest={res => {
            if (res.url.indexOf('/tech') > -1) {
              return false;
            }
            this.responses(res.url);
            return true;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#dfc4fc', flex: 1},
  webView: {flex: 1},
});
