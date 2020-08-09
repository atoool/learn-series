import React, {Component, PureComponent} from 'react';
import {
  View,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import WebView from 'react-native-webview';
import PremiumCheckFun from '../comp/PremiumCheckFun';
import Loading from '../comp/Loading';
import R from '../res/R';
import AsyncStorage from '@react-native-community/async-storage';
import {ContextStates} from '../func/ContextStates';
import {PremSuccess} from '../comp/PremSuccess';

const {width, height} = Dimensions.get('window');

export default class Onboarding extends PureComponent {
  static contextType = ContextStates;
  abortController = new AbortController();
  state = {
    price: 0,
    microPrice: 0,
    sixMonthPrice: 0,
    monthlyPrice: 0,
    premiumCalled: false,
    htmlUrl: null,
    load: true,
  };

  _onNavigationStateChange = async a => {
    let url = a.url;
    // if (url.indexOf('stories.riafy.me') > -1) return false;
    if (url.indexOf('#slide6') > -1) {
      return false;
    } else if (url.indexOf('http://riafy.me/onboarding/') > -1) {
      let jsonURL = JSON.parse(
        decodeURI(url.split('http://riafy.me/onboarding/')[1]),
      );
      // console.warn(url);

      if (jsonURL.iap === '6month') {
        let u = a.url.substring(a.url.indexOf('%'));
        let dec = decodeURI(u);
        await AsyncStorage.setItem('urlVal', dec).catch(e => {});
        PremiumCheckFun.purchaseSixMonthSubs();
        return false;
      }
      return false;
    } else if (url.indexOf('/skip/') > -1) {
      let u = a.url.substring(a.url.indexOf('%'));
      let dec = decodeURI(u);
      this.props.navigation.navigate('MainTab');
      await AsyncStorage.setItem('urlVal', dec).catch(e => {});
      await AsyncStorage.setItem('@ONBOARDING', 'HIDE').catch(e => {});
      return false;
    } else if (url.indexOf('/terms') > -1) {
      this.props.navigation.navigate('Terms');
      return false;
    } else if (url.indexOf('/privacy') > -1) {
      this.props.navigation.navigate('Privacy');
      return false;
    } else if (url.indexOf('/restore') > -1) {
      let restore = await PremiumCheckFun.checkPurchased();
      restore === true
        ? Alert.alert('Your purchase has been successfully restored')
        : Alert.alert(
            'Failed to restore purchase! couldn`t find any previous purchase',
          );
      return false;
    }
  };

  componentDidMount = async () => {
    const lang = await AsyncStorage.getItem('lang').catch(e => {});
    let prices = await PremiumCheckFun.showPrice();
    if (prices[0] == null || prices[1] == null || prices[2] == null)
      prices = await PremiumCheckFun.showPrice();
    this.setState({
      price: prices[0],
      sixMonthPrice: prices[1],
      monthlyPrice: prices[2],
    });

    Platform.OS === 'ios'
      ? await fetch('Web.bundle/onboarding/onboarding.html')
          .then(
            e =>
              this.state.htmlUrl === null &&
              this.setState({
                htmlUrl: e.url.concat(
                  `?lang=${lang}&simcountry=in&appname=${
                    R.strings.bundleId
                  }&iOS`,
                ),
              }),
          )
          .catch(err => {
            // alert('Check your network connectivity');
          })
      : this.setState({
          htmlUrl: `file:///android_asset/onboarding/onboarding.html?lang=${lang}&simcountry=in&appname=${
            R.strings.bundleId
          }`,
        });

    PremiumCheckFun.purchaseListener(this);
  };
  componentWillUnmount = async () => {
    PremiumCheckFun.purchaseListenerRemove();
  };

  render() {
    if (this.state.htmlUrl == null) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            marginTop: Platform.OS === 'ios' ? (height > 750 ? -45 : 0) : 2,
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: '#fff',
          }}>
          <Loading load={this} />
        </SafeAreaView>
      );
    } else if (
      this.state.purchasedPremium === 'yup' ||
      this.state.purchasedPremium === 'success'
    )
      return <PremSuccess that={this} />;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          marginTop: Platform.OS === 'ios' ? (height > 750 ? -45 : 0) : 2,
        }}>
        <StatusBar hidden />
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior="padding"
          enabled={true}>
          <WebView
            key={this.context.connected}
            startInLoadingState
            cacheEnabled
            onError={() => {
              this.setState({load: false});
            }}
            renderError={() => <Loading load={this} />}
            renderLoading={() => <Loading load={this} />}
            style={{flex: 1}}
            source={{
              uri: this.state.htmlUrl,
            }}
            scrollEnabled={false}
            pagingEnabled={true}
            allowingReadAccessToURL={'Web.bundle'}
            allowsBackForwardNavigationGestures={true}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            injectedJavaScript={`javascript:setIAPValues('6month',"${
              this.state.sixMonthPrice
            }")`}
            onShouldStartLoadWithRequest={a => {
              if (a.url.indexOf('stories.riafy.me') > -1) return false;
              this._onNavigationStateChange(a);
              return true;
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
