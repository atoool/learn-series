import React from 'react';
import {StyleSheet, StatusBar, View, ActivityIndicator} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import MainNavigator from './src/MainNavigator';
import {ContextStates, MyTheme, fetchData} from './src/func/ContextStates';
import Player from './src/comp/Player';

class App extends React.PureComponent {
  state = {loader: false, appData: null, play: false};

  componentDidMount = async () => {
    await this.getAppData();
  };

  componentWillUnmount = () => {};

  getAppData = async () => {
    let appData = await fetchData();
    this.setState({appData});
  };

  activateLoader = () => {
    // this.setState({loader: true});
    // setTimeout(() => {
    //   this.setState({loader: false});
    // }, 1500);
  };

  playVideo = () => {
    this.setState({play: !this.state.play});
  };

  render() {
    return (
      <ContextStates.Provider
        value={{
          loader: this.state.loader,
          activateLoader: this.activateLoader,
          appData: this.state.appData,
          getAppData: async () => await this.getAppData(),
          playVideo: this.playVideo,
        }}>
        <View style={{flex: 1}}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          {this.state.play && <Player />}
          <View
            style={
              !this.state.play
                ? {flex: 1}
                : {flex: 0, position: 'absolute', zIndex: 0}
            }>
            <NavigationContainer>
              <MainNavigator />
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
