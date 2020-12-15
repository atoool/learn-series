import React, {Component} from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import Loading from '../comp/Loading';
import R from '../res/R';
import AsyncStorage from '@react-native-community/async-storage';
import {ContextStates} from '../func/ContextStates';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import firebase from 'react-native-firebase';

export default class Terms extends Component {
  static contextType = ContextStates;
  state = {load: false, lang: 'en'};
  componentDidMount = async () => {
    let lang = await AsyncStorage.getItem('lang').catch((e) => {});
    lang && this.setState({lang});
    // firebase.analytics().setCurrentScreen('Terms screen', 'Terms');
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
      <View style={{flex: 1, backgroundColor: R.colors.background,paddingTop:hp(3.5)}}>
        {/* <StatusBar barStyle="dark-content" /> */}
        <WebView
          key={this.context.connected}
          cacheEnabled
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          renderError={() => {
            return <Loading load={this} />;
          }}
          source={{
            uri: `http://riafy.me/wellness/terms.php?appname=${R.locale.appName}&lang=${this.state.lang}`,
          }}
          style={{flex: 1}}
          onHttpError={() => {
            this.setState({load: false});
          }}
          onError={() => {
            this.setState({load: false});
            // alert(R.locale.network);
          }}
          startInLoadingState
          renderLoading={() => <Loading load={this} />}
        />
      </View>
    );
  }
}
