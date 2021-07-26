import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Platform} from 'react-native';
import WebView from 'react-native-webview';
import Loading from '../comp/Loading';
import R from '../res/R';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ContextStates} from '../func/ContextStates';

export default class ChangePref extends Component {
  static contextType = ContextStates;
  state = {
    htmlUrl: null,
    load: true,
  };

  _onNavigationStateChange = async a => {
    if (a.url.indexOf('fitness') > -1) {
      let u = a.url.substring(a.url.indexOf('%'));
      let dec = decodeURI(u);
      let j = JSON.parse(dec);
      let weightData = [];
      await AsyncStorage.getItem('weight').then(r => {
        if (r != null) {
          weightData = JSON.parse(r);
        } else {
          weightData = [{weight: 60}];
        }
      });
      weightData[0].weight = parseInt(j.weight);
      await AsyncStorage.setItem('height', JSON.stringify(j.height)).catch(
        e => {},
      );
      await AsyncStorage.setItem('weight', JSON.stringify(weightData)).catch(
        e => {},
      );
      await AsyncStorage.setItem('urlVal', dec).catch(e => {});
      await AsyncStorage.setItem('initWeight', JSON.stringify(j.weight)).catch(
        e => {},
      );
      await AsyncStorage.setItem('goalWeight', JSON.stringify(j.tweight)).catch(
        e => {},
      );
      await AsyncStorage.multiSet([
        ['@ONBOARDING', 'HIDE'],
        ['rateus', '2nd'],
      ]).catch(e => {});
      this.props.navigation.replace('MainTab');
      return false;
    } else if (a.url.indexOf('stories')) {
      return false;
    }
    return true;
  };

  componentDidMount = async () => {
    let lang = await AsyncStorage.getItem('lang').catch(e => {});
    if (!lang) {
      lang = 'en';
    }
    Platform.OS === 'ios'
      ? await fetch('Web.bundle/onboarding/changePref.html')
          .then(
            e =>
              this.state.htmlUrl === null &&
              this.setState({
                htmlUrl: e.url.concat(
                  `?lang=${lang}&simcountry=in&appname=${R.strings.bundleId}`,
                ),
              }),
          )
          .catch(() => {})
      : this.setState({
          htmlUrl: `file:///android_asset/onboarding/changePref.html?lang=${lang}&simcountry=in&appname=${R.strings.bundleId}`,
        });
  };

  componentWillUnmount = () => {};

  render() {
    if (this.state.htmlUrl == null) {
      return <Loading load={this} />;
    }
    return (
      <SafeAreaView style={styles.container}>
        <WebView
          key={this.context.connected}
          style={styles.webview}
          ref={webview => {
            this.webview = webview;
          }}
          cacheEnabled
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          source={{uri: this.state.htmlUrl}}
          onShouldStartLoadWithRequest={a => {
            if (a.url.indexOf('/tech') > -1) {
              return false;
            }
            this._onNavigationStateChange(a);
            return true;
          }}
          originWhitelist={['*']}
          onError={() => {
            this.setState({load: false});
          }}
          onHttpError={() => {
            this.setState({load: false});
          }}
          renderError={() => {
            return <Loading load={this} />;
          }}
          startInLoadingState
          renderLoading={() => <Loading load={this} />}
        />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  webview: {flex: 1},
});
