import React, {Component} from 'react';
import {SafeAreaView, Dimensions, Alert, Platform} from 'react-native';
import WebView from 'react-native-webview';
import {
  purchaseSixMonthSubs,
  purchaseMonthlySubs,
  purchasePremium,
  purchaseListener,
  purchaseListenerRemove,
} from '../comp/PremiumCheckFun';
import Loading from '../comp/Loading';
import R from '../res/R';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PremSuccess} from '../comp/PremSuccess';
import {ContextStates} from '../func/ContextStates';
import {StyleSheet} from 'react-native';

const {height} = Dimensions.get('window');

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
        `javascript:setIAPValues('monthly',"${this.state.monthlyPrice}")`,
      );
      this.webview.injectJavaScript(
        `javascript:setIAPValues('6month',"${this.state.sixMonthPrice}")`,
      );
      this.webview.injectJavaScript(
        `javascript:setIAPValues('lifetime',"${this.state.price}"||"${this.state.price}000000")`,
      );
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
    } else if (url.indexOf('/premium/') > -1) {
      let jsonURL = JSON.parse(
        decodeURI(url.split('http://riafy.me/premium/')[1]),
      );
      if (jsonURL.iap === '6month') {
        purchaseSixMonthSubs();
      } else if (jsonURL.iap === 'monthly') {
        purchaseMonthlySubs();
      } else if (jsonURL.iap === 'lifetime') {
        purchasePremium();
      }
      return false;
    }
  };

  componentDidMount = async () => {
    const lang = await AsyncStorage.getItem('lang').catch(e => {});
    let {prices} = this.context.reduState;
    this.setState({
      price: prices[0],
      sixMonthPrice: prices[1],
      monthlyPrice: prices[2],
    });
    Platform.OS === 'ios'
      ? await fetch('Web.bundle/onboarding/premium.html')
          .then(
            e =>
              this.state.htmlUrl === null &&
              this.setState({
                htmlUrl: e.url.concat(
                  `?lang=${lang}&simcountry=in&appname=${R.strings.bundleId}&iOS`,
                ),
              }),
          )
          .catch(() => {})
      : this.setState({
          htmlUrl: `file:///android_asset/onboarding/premium2021.html?lang=${lang}&simcountry=in&appname=${R.strings.bundleId}`,
        });
    purchaseListener(this);
  };
  componentWillUnmount() {
    purchaseListenerRemove();
  }

  render() {
    if (
      this.state.purchasedPremium === 'yup' ||
      this.state.purchasedPremium === 'success'
    ) {
      return <PremSuccess that={this} />;
    }

    return (
      <SafeAreaView style={styles.container}>
        <WebView
          key={this.context.connected}
          style={styles.container}
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
            if (a.url.indexOf('/tech') > -1) {
              return false;
            }
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
const styles = StyleSheet.create({
  container: {flex: 1},
});
