import React, {Component} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  View,
  StatusBar,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import PremiumCheckFun from '../comp/PremiumCheckFun';
import Loading from '../comp/Loading';
import R from '../res/R';
import AsyncStorage from '@react-native-community/async-storage';
import {PremSuccess} from '../comp/PremSuccess';
import ContextStates from '../func/ContextStates';

const {width, height} = Dimensions.get('window');

export default class Premium extends Component {
  static contextType = ContextStates;
  state = {
    price: 0,
    microPrice: 0,
    sixMonthPrice: 0,
    monthlyPrice: 0,
    purchasedPremium: 'no',
    premiumCalled: false,
    htmlUrl: null,
    load: false,
  };
  _onNavigationStateChange = async a => {
    let url = a.url;

    if (url.indexOf('/refresh') > -1) {
      this.webview.injectJavaScript(
        `javascript:setIAPValues('6month',"${this.state.sixMonthPrice}")`,
      );

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
    } else if (url.indexOf('/premium/') > -1) {
      let jsonURL = JSON.parse(
        decodeURI(url.split('http://riafy.me/premium/')[1]),
      );
      if (jsonURL.iap === '6month') {
        PremiumCheckFun.purchaseSixMonthSubs();
      } else if (jsonURL.iap === 'monthly') {
        PremiumCheckFun.purchaseMonthlySubs();
      } else if (jsonURL.iap === 'lifetime') {
        PremiumCheckFun.purchasePremium();
      }
      return false;
    }
  };

  componentDidMount = async () => {
    PremiumCheckFun.purchaseListener(this);
    const lang = await AsyncStorage.getItem('lang').catch(e => {});
    let prices = await PremiumCheckFun.showPrice();

    if (prices[0] == null || prices[1] == null || prices[2] == null)
      prices = await PremiumCheckFun.showPrice();
    this.setState({
      price: prices[0],
      sixMonthPrice: prices[1],
      monthlyPrice: prices[2],
    });
    await fetch('Web.bundle/onboarding/premium.html')
      .then(
        e =>
          this.state.htmlUrl === null &&
          this.setState({
            htmlUrl: e.url.concat(
              `?lang=${lang}&simcountry=in&appname=${R.strings.bundleId}&iOS`,
            ),
          }),
      )
      .catch(err => {
        // alert('Check your network connectivity');
      });
  };
  componentWillUnmount() {
    PremiumCheckFun.purchaseListenerRemove();
  }

  render() {
    if (this.state.htmlUrl == null) {
      return <View style={{flex: 1}} />;
    } else if (
      this.state.purchasedPremium === 'yup' ||
      this.state.purchasedPremium === 'success'
    )
      return <PremSuccess that={this} />;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          marginTop: height > 736 ? -45 : 0,
          backgroundColor: '#fff',
        }}>
        <StatusBar hidden={true} />
        <WebView
          key={this.context.connected}
          style={{flex: 1}}
          ref={webview => {
            this.webview = webview;
          }}
          source={{
            uri: this.state.htmlUrl,
          }}
          scrollEnabled={false}
          pagingEnabled={true}
          allowingReadAccessToURL={'Web.bundle'}
          allowsBackForwardNavigationGestures={true}
          originWhitelist={['*']}
          onShouldStartLoadWithRequest={a => {
            if (a.url.indexOf('stories.riafy.me') > -1) return false;
            this._onNavigationStateChange(a);
            return true;
          }}
          cacheEnabled
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          onError={() => {
            this.setState({load: false});
          }}
          renderError={() => <Loading load={this} />}
          startInLoadingState
          renderLoading={() => <Loading load={this} />}
        />
      </SafeAreaView>
    );
  }
}
