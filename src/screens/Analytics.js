import React from 'react';
import WebView from 'react-native-webview';
import {View} from 'react-native';

export default class Analytics extends React.PureComponent {
  state = {};
  responses = async (url) => {
    if (url.indexOf('goback') > -1) this.props.navigation.goBack();
    else if (url.indexOf('/premium') > -1)
      this.props.navigation.navigate('Premium');
    else {
    }
  };
  render() {
    return (
      <View style={{backgroundColor: '#dfc4fc', flex: 1}}>
        <WebView
          ref={(r) => (this.webview = r)}
          style={{flex: 1}}
          source={{
            uri:
              'file:///android_asset/onboarding/analytics.html?lang=en&appname=keto.weightloss.diet.plan&data=1',
          }}
          onShouldStartLoadWithRequest={(res) => {
            if (res.url === 'https:///tech/') return false;
            this.responses(res.url);
            return true;
          }}
        />
      </View>
    );
  }
}
