import React from 'react';
import {StatusBar, StyleSheet, BackHandler, SafeAreaView} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {ContextStates} from './src/func/ContextStates';
import AppContainer from './src/navigations/AppContainer';
import {reducer, init} from './src/func/Reducer';
import NetInfo from '@react-native-community/netinfo';
import ExitAlert from './src/comp/ExitAlert';
import SnackBar from 'react-native-snackbar-component';
import R from './src/res/R';
import analytics from '@react-native-firebase/analytics';
import * as RNIap from 'react-native-iap';
import NotificationService from './src/comp/NotificationService';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.notif = new NotificationService(this.onRegister, this.onNotif);
    this.state = {
      play: false,
      onboard: false,
      type: '',
      playIndex: 0,
      notific: null,
    };
  }
  onRegister = token => {
    this.setState({registerToken: token?.token, fcmRegistered: true});
    this.notif?.subscribeTopic();
  };

  onNotif = notific => {
    this.notific = notific;
  };

  handlePerm = perms => {
    !perms.alert && this.notif?.requestPermissions();
  };
  onBackpress = () => {
    if (!this.navig?.canGoBack()) {
      this.exit && this.exit?.setState({show: true});
      return true;
    } else {
      return false;
    }
  };

  componentDidMount = async () => {
    this.notif?.checkPermission(this.handlePerm);
    this.notif?.scheduleNotif();
    const data = await init(this.state);
    await this.dispatch({type: 'init', payload: data});

    BackHandler.addEventListener('hardwareBackPress', this.onBackpress);

    const result = await RNIap.initConnection();
    result == null && (await RNIap.initConnection());
    this.unsubscribe == null &&
      (this.unsubscribe = NetInfo.addEventListener(state => {
        this.setState({connected: state?.isConnected});
      }));
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

    const route = state?.routes[state.index];

    if (route?.state) {
      return this.getActiveRouteName(route?.state);
    }

    return route?.name;
  };

  render() {
    const Themes = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: R.colors.background,
      },
    };
    return (
      <ContextStates.Provider
        value={{
          playVideo: this.playVideo,
          dispatch: this.dispatch,
          reduState: this.state,
          notific: this.notific,
        }}>
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor={R.colors.statusBar} />
          <NavigationContainer
            ref={re => (this.navig = re)}
            theme={Themes}
            onStateChange={state => {
              const previousRouteName = this.routeName ? this.routeName : '';
              const currentRouteName = this.getActiveRouteName(state);
              if (previousRouteName !== currentRouteName) {
                analytics().logScreenView({screen_name: currentRouteName});
                this.routeName = currentRouteName;
              }
            }}>
            <AppContainer />
            {this.state.connected != null && (
              <SnackBar
                visible={!this.state.connected}
                textMessage={'Network error' + '!'}
                backgroundColor="#e84a5f"
              />
            )}
            <ExitAlert ref={exitalert => (this.exit = exitalert)} />
          </NavigationContainer>
        </SafeAreaView>
      </ContextStates.Provider>
    );
  }
}
export default App;

const styles = StyleSheet.create({container: {flex: 1}});
