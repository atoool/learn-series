import React from 'react';
import WebView from 'react-native-webview';
import {StatusBar, View} from 'react-native';

export default class Rewards extends React.PureComponent {
  state = {};
  render() {
    return (
      <View style={{backgroundColor: '#dfc4fc', flex: 1}}>
        <WebView
          containerStyle={{
            flex: 1,
            marginTop: 20,
            backgroundColor: '#dfc4fc',
          }}
          source={{
            uri:
              'file:///android_asset/onboarding/rewards.html?lang=en&appname=keto.weightloss.diet.plan',
          }}
        />
      </View>
    );
  }
}
