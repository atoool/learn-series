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
import Loading from '../comp/Loading';
import R from '../res/R';
import AsyncStorage from '@react-native-community/async-storage';
import {ContextStates} from '../func/ContextStates';
import {PremSuccess} from '../comp/PremSuccess';
import {
  purchaseSixMonthSubs,
  checkPurchased,
  showPrice,
  purchaseListener,
  purchaseListenerRemove,
  purchasePremium,
  purchaseMonthlySubs,
} from '../comp/PremiumCheckFun';

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
    purchased: false,
  };

  _onNavigationStateChange = async a => {
    let url = a.url;
    console.warn(url);

    // if (url.indexOf('stories.riafy.me') > -1) return false;
    if (url.indexOf('/vibrate') > -1) {
      // console.warn('inside refresh');
      // this.webview.stopLoading();
      this.webview.injectJavaScript(
        `javascript:setIAPValues('monthly',"${this.state.monthlyPrice}")`,
      );
      this.webview.injectJavaScript(
        `javascript:setIAPValues('6month',"${this.state.sixMonthPrice}")`,
      );
      this.webview.injectJavaScript(
        `javascript:setIAPValues('lifetime',"${this.state.price}"||"${
          this.state.price
        }000000")`,
      );
      return false;
    } else if (url.indexOf('http://riafy.me/onboarding/') > -1) {
      let jsonURL = JSON.parse(
        decodeURI(url.split('http://riafy.me/onboarding/')[1]),
      );
      // console.warn(url);

      if (jsonURL.iap === '6month') {
        let u = a.url.substring(a.url.indexOf('%'));
        let dec = decodeURI(u);
        await AsyncStorage.multiSet([
          ['urlVal', dec],
          ['@ONBOARDING', 'HIDE'],
          ['rateus', '2nd'],
        ]).catch(e => {});
        this.state.purchased
          ? this.props.navigation.replace('MainTab')
          : purchaseSixMonthSubs();
        return false;
      } else if (jsonURL.iap === 'monthly') {
        let u = a.url.substring(a.url.indexOf('%'));
        let dec = decodeURI(u);
        await AsyncStorage.multiSet([
          ['urlVal', dec],
          ['@ONBOARDING', 'HIDE'],
          ['rateus', '2nd'],
        ]).catch(e => {});
        this.state.purchased
          ? this.props.navigation.replace('MainTab')
          : purchaseMonthlySubs();
        return false;
      } else if (jsonURL.iap === 'lifetime') {
        let u = a.url.substring(a.url.indexOf('%'));
        let dec = decodeURI(u);
        await AsyncStorage.multiSet([
          ['urlVal', dec],
          ['@ONBOARDING', 'HIDE'],
          ['rateus', '2nd'],
        ]).catch(e => {});
        this.state.purchased
          ? this.props.navigation.replace('MainTab')
          : purchasePremium();
        return false;
      }
      return false;
    } else if (url.indexOf('/skip/') > -1) {
      let u = a.url.substring(a.url.indexOf('%'));
      let dec = decodeURI(u);
      this.props.navigation.replace('MainTab');
      await AsyncStorage.multiSet([
        ['urlVal', dec],
        ['@ONBOARDING', 'HIDE'],
        ['rateus', '2nd'],
      ]).catch(e => {});
      return false;
    } else if (url.indexOf('/terms') > -1) {
      this.props.navigation.navigate('Terms');
      return false;
    } else if (url.indexOf('/privacy') > -1) {
      this.props.navigation.navigate('Privacy');
      return false;
    } else if (url.indexOf('/restore') > -1) {
      let {premiumPurchased} = this.context.reduState;
      premiumPurchased === true
        ? Alert.alert('Your purchase has been successfully restored')
        : Alert.alert(
            'Failed to restore purchase! couldn`t find any previous purchase',
          );
      return false;
    }
  };

  componentDidMount = async () => {
    const lang = await AsyncStorage.getItem('lang').catch(e => {});
    let purchased = this.context.reduState.premiumPurchased;
    let {prices} = this.context.reduState;

    this.setState({
      price: prices[0],
      sixMonthPrice: prices[1],
      monthlyPrice: prices[2],
      purchased,
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

    purchaseListener(this);
  };
  componentWillUnmount = async () => {
    purchaseListenerRemove();
  };

  render() {
    if (
      this.state.purchasedPremium === 'yup' ||
      this.state.purchasedPremium === 'success'
    )
      return <PremSuccess that={this} />;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: R.colors.background,
        }}>
        <WebView
          ref={re => (this.webview = re)}
          key={this.context.connected}
          startInLoadingState
          cacheEnabled
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
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
          onShouldStartLoadWithRequest={a => {
            if (a.url.indexOf('stories.riafy.me') > -1) return false;
            this._onNavigationStateChange(a);
            return true;
          }}
        />
      </SafeAreaView>
    );
  }
}
