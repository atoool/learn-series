import React, {Component} from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import Loading from '../comp/Loading';
import R from '../res/R';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ContextStates} from '../func/ContextStates';
// import firebase from 'react-native-firebase';

export default class Privacy extends Component {
  static contextType = ContextStates;
  state = {load: true, lang: 'en'};

  componentDidMount = async () => {
    let lang = await AsyncStorage.getItem('lang').catch(e => {});
    lang && this.setState({lang});
    // firebase.analytics().setCurrentScreen('Privacy screen', 'Privacy');
  };
  componentWillUnmount = () => {
    // this.props.route.params.type === 'settings' &&
    //   this.props.navigation.dangerouslyGetParent().setOptions({
    //     tabBarVisible: true,
    //   });
  };

  render() {
    // if (this.state.load === false) {
    //   return <Loading load={this} />;
    // }
    return (
      <View style={{flex: 1, backgroundColor: R.colors.background}}>
        <WebView
          renderError={() => {
            return <Loading load={this} />;
          }}
          key={this.context.connected}
          showsHorizontalScrollIndicator={false}
          cacheEnabled
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          source={{
            uri: `http://riafy.me/wellness/privacy.php?appname=${R.locale.appName}&lang=${this.state.lang}&simcountry=in`,
          }}
          style={{flex: 1}}
          onError={() => {
            this.setState({load: false});
          }}
          renderLoading={() => <Loading load={this} />}
          startInLoadingState
        />
      </View>
    );
  }
}
