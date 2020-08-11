import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  ActivityIndicator,
  AppState,
  BackHandler,
  Alert,
} from 'react-native';
import {NavigationContainer, CommonActions} from '@react-navigation/native';
import MainNavigator from './src/navigations/MainNavigator';
import {ContextStates, MyTheme} from './src/func/ContextStates';
import Player from './src/comp/Player';
import AppContainer from './src/navigations/AppContainer';
import AsyncStorage from '@react-native-community/async-storage';
import {reducer, init} from './src/func/Reducer';
import NetInfo from '@react-native-community/netinfo';
import ExitAlert from './src/comp/ExitAlert';
import SnackBar from 'react-native-snackbar-component';
import R from './src/res/R';
import analytics from '@react-native-firebase/analytics';
import * as RNIap from 'react-native-iap';
import NotificationService from './src/comp/NotificationService';

// console.disableYellowBox = true;

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      play: false,
      onboard: false,
      type: '',
      playIndex: 0,
      connected: true,
      notific: null,
    };

    this.notif = new NotificationService(this.onRegister, this.onNotif);
  }
  onRegister = token => {
    this.setState({registerToken: token.token, fcmRegistered: true});
    this.notif.subscribeTopic();
  };

  onNotif = notific => {
    this.notific = notific;
  };

  handlePerm = perms => {
    !perms.alert && this.notif.requestPermissions();
  };

  componentDidMount = async () => {
    this.notif.checkPermission(this.handlePerm);
    this.notif.scheduleNotif();
    this.unsubscribe == null &&
      (this.unsubscribe = NetInfo.addEventListener(state => {
        this.setState({connected: state.isConnected});
      }));
    this.appstate == null &&
      (this.appstate = AppState.addEventListener('change', nex => {
        if (nex == 'active')
          this.back == null &&
            (this.back = BackHandler.addEventListener(
              'hardwareBackPress',
              () => {
                let bck = this.navig ? this.navig.canGoBack() : true;
                !bck && this.exit && this.exit?.setState({show: true});
                return !bck;
              },
            ));
        else if (nex === 'inactive')
          this.back != null &&
            (this.back = BackHandler.removeEventListener(
              'hardwareBackPress',
              () => {
                return true;
              },
            ));
      }));
    const data = await init(this.state);
    await this.dispatch({type: 'init', payload: data});

    const result = await RNIap.initConnection();
    result == null && (await RNIap.initConnection());
  };

  componentWillUnmount = () => {};

  playVideo = (type, playIndex) => {
    this.setState({play: !this.state.play, type, playIndex});
  };

  dispatch = async action => {
    this.setState(await reducer(this.state, action));
  };

  getActiveRouteName = state => {
    if (!state || typeof state.index !== 'number') {
      return 'Unknown';
    }

    const route = state.routes[state.index];

    if (route.state) {
      return this.getActiveRouteName(route.state);
    }

    return route.name;
  };

  render() {
    return (
      <ContextStates.Provider
        value={{
          playVideo: this.playVideo,
          dispatch: this.dispatch,
          reduState: this.state,
          notific: this.notific,
        }}>
        <View style={{flex: 1}}>
          <StatusBar hidden />
          {/* {this.state.play && (
            <Player playIndex={this.state.playIndex} type={this.state.type} />
          )} */}
          <View
            style={
              !this.state.play
                ? {flex: 1}
                : {flex: 0, position: 'absolute', zIndex: 0}
            }>
            <NavigationContainer
              ref={re => (this.navig = re)}
              onStateChange={state => {
                const previousRouteName = this.routeName ? this.routeName : '';
                const currentRouteName = this.getActiveRouteName(state);
                if (previousRouteName !== currentRouteName) {
                  analytics().setCurrentScreen(currentRouteName);
                  this.routeName = currentRouteName;
                }
              }}>
              <AppContainer
                onNotif={this.messageNotif ? this.messageNotif : ''}
              />
              <SnackBar
                visible={!this.state.connected}
                textMessage={'Network error' + '!'}
                backgroundColor="#e84a5f"
              />

              <ExitAlert ref={exitalert => (this.exit = exitalert)} />
            </NavigationContainer>
          </View>
        </View>
      </ContextStates.Provider>
    );
  }
}
export default App;

// var styles = StyleSheet.create({

// });
