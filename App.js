import React from 'react';
import {StyleSheet, StatusBar, View, ActivityIndicator} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import MainNavigator from './src/navigations/MainNavigator';
import {ContextStates, MyTheme} from './src/func/ContextStates';
import Player from './src/comp/Player';
import AppContainer from './src/navigations/AppContainer';
import AsyncStorage from '@react-native-community/async-storage';
import {reducer, init} from './src/func/Reducer';

// console.disableYellowBox = true;

class App extends React.PureComponent {
  state = {play: false, onboard: false, type: '', playIndex: 0};

  componentDidMount = async () => {
    // await AsyncStorage.clear();
    const data = await init(this.state);
    await this.dispatch({type: 'init', payload: data});
  };

  componentWillUnmount = () => {};

  playVideo = (type, playIndex) => {
    this.setState({play: !this.state.play, type, playIndex});
  };

  dispatch = async action => {
    this.setState(await reducer(this.state, action));
  };

  render() {
    return (
      <ContextStates.Provider
        value={{
          playVideo: this.playVideo,
          dispatch: this.dispatch,
          reduState: this.state,
        }}>
        <View style={{flex: 1}}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          {this.state.play && (
            <Player playIndex={this.state.playIndex} type={this.state.type} />
          )}
          <View
            style={
              !this.state.play
                ? {flex: 1}
                : {flex: 0, position: 'absolute', zIndex: 0}
            }>
            <NavigationContainer>
              <AppContainer />
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
