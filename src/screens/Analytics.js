import React from 'react';
import WebView from 'react-native-webview';
import {View} from 'react-native';

export default class Analytics extends React.PureComponent {
  state = {};
  responses = async url => {
    if (url.indexOf('goback') > -1) this.props.navigation.goBack();
    else if (url.indexOf('/premium') > -1)
      this.props.navigation.navigate('Premium');
    else console.warn(res.url);
  };
  render() {
    return (
      <View style={{backgroundColor: '#dfc4fc', flex: 1}}>
        <WebView
          ref={r => (this.webview = r)}
          style={{flex: 1, marginTop: 20, backgroundColor: '#dfc4fc'}}
          source={{
            uri:
              'file:///android_asset/onboarding/analytics.html?lang=en&appname=keto.weightloss.diet.plan&data=1',
          }}
          onShouldStartLoadWithRequest={res => {
            if (res.url === 'https://stories.riafy.me/') return false;
            this.responses(res.url);
            return true;
          }}
        />
      </View>
    );
  }
}
