import React from 'react';
import WebView from 'react-native-webview';
import {View} from 'react-native';
import {ContextStates} from '../func/ContextStates';
import {StyleSheet} from 'react-native';

export default class Rewards extends React.PureComponent {
  static contextType = ContextStates;
  render() {
    const {lang} = this.context.reduState;
    return (
      <View style={styles.container}>
        <WebView
          containerStyle={styles.webview}
          source={{
            uri: `file:///android_asset/onboarding/rewards.html?lang=${lang}&appname=keto.weightloss.diet.plan`,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#dfc4fc', flex: 1},
  webview: {flex: 1},
});
