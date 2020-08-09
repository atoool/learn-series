import React, {Component} from 'react';
import {
  View,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import Loading from '../comp/Loading';
import R from '../res/R';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ContextStates} from '../func/ContextStates';

const {height, width} = Dimensions.get('window');

export default class ChangePref extends Component {
  static contextType = ContextStates;
  state = {
    htmlUrl: null,
    load: true,
  };

  _onNavigationStateChange = async a => {
    console.warn(a.url);

    if (a.url.indexOf('fitness') > -1) {
      let u = a.url.substring(a.url.indexOf('%'));
      let dec = decodeURI(u);
      let j = JSON.parse(dec);
      let weightData = [];
      await AsyncStorage.getItem('weight').then(r => {
        if (r != null) weightData = JSON.parse(r);
        else weightData = [{weight: 60}];
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
      this.props.navigation.pop();
      this.props.navigation.navigate('Home');
      return false;
    } else if (a.url.indexOf('stories')) return false;
    return true;
  };

  componentDidMount = async () => {
    let lang = await AsyncStorage.getItem('lang').catch(e => {});
    if (lang == null) lang = 'en';
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
          .catch(err => {
            // alert('Check your network connectivity');
          })
      : this.setState({
          htmlUrl: `file:///android_asset/onboarding/changePref.html?lang=${lang}&simcountry=in&appname=${
            R.strings.bundleId
          }`,
        });
  };

  componentWillUnmount = () => {};

  render() {
    if (this.state.htmlUrl == null) {
      return (
        <View style={{flex: 1}}>
          {Platform.OS === 'ios' && height > 750 && (
            <View
              style={{
                height: hp(5),
                backgroundColor: R.colors.primary,
                width: '100%',
              }}
            />
          )}
          <View>
            <Loading load={this} />
          </View>
        </View>
      );
    }
    return (
      <SafeAreaView
        style={{
          flex: 1,
          marginTop: Platform.OS === 'ios' ? (width < 375 ? wp(8.3) : 0) : 0,
          backgroundColor: '#fafafa',
        }}>
        {/* <StatusBar hidden={true} /> */}
        <WebView
          key={this.context.connected}
          style={{flex: 1}}
          ref={webview => {
            this.webview = webview;
          }}
          cacheEnabled
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          source={{uri: this.state.htmlUrl}}
          onShouldStartLoadWithRequest={a => {
            if (a.url.indexOf('stories.riafy.me') > -1) return false;
            this._onNavigationStateChange(a);
            return true;
          }}
          originWhitelist={['*']}
          onError={() => {
            // alert(R.locale.network);
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
