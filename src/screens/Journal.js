import React from 'react';
import {View, Text} from 'react-native';
import WebView from 'react-native-webview';
import {Button} from 'react-native-elements';
import {TouchableNativeFeedback} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TimeType} from '../func/TimeFunc';
import * as Animatable from 'react-native-animatable';
import {ImageBackground} from 'react-native';
import R from '../res/R';

export default class Jounal extends React.PureComponent {
  state = {usr: '', pulse: 'pulse'};
  componentDidMount = async () => {
    this.focus = this.props.navigation.addListener('focus', async () => {
      const usr = await AsyncStorage.getItem('username').catch(e => {});
      this.setState({usr, pulse: 'pulse'});
    });
    this.blur = this.props.navigation.addListener('blur', async () => {
      this.setState({pulse: 'slideInDown'});
    });
  };
  componentWillUnmount = () => {
    this.focus();
    this.blur();
  };
  render() {
    return (
      <View style={{flex: 1, padding: 20, paddingTop: 100}}>
        <Animatable.View
          style={{marginBottom: 30}}
          // animation={this.state.pulse}
          // iterationCount={2}
          // easing="ease-in"
        >
          <Text style={{fontSize: 22, fontWeight: 'bold', color: '#474a56'}}>
            {TimeType()}
          </Text>
          <Text style={{fontSize: 22, fontWeight: 'bold', color: '#474a56'}}>
            {this.state.usr}
          </Text>
        </Animatable.View>
        <TouchableNativeFeedback
          useForeground
          onPress={() => this.props.navigation.navigate('DailyLog')}>
          <View
            style={{
              marginBottom: 20,
              backgroundColor: 'darkgrey',
              borderRadius: 5,
              overflow: 'hidden',
            }}>
            <ImageBackground
              source={{
                uri: 'https://fstream.in/journal/home/home-create-book.webp',
              }}
              style={{
                padding: 20,
              }}>
              <Text style={{fontSize: 16, color: '#fff'}}>Monday</Text>
              <Text style={{fontSize: 20, color: '#fff', fontWeight: 'bold'}}>
                May
              </Text>
              <Text style={{fontSize: 20, color: '#fff', fontWeight: 'bold'}}>
                11
              </Text>
              <Text style={{fontSize: 16, color: '#fff', marginBottom: 60}}>
                How do you feel today?
              </Text>
              <Button
                onPress={() => {
                  this.props.navigation.navigate('DailyLog');
                }}
                title="Create Story"
                useForeground
                titleStyle={{fontSize: 14}}
                containerStyle={{overflow: 'hidden', borderRadius: 20}}
                buttonStyle={{
                  alignSelf: 'center',
                  borderRadius: 20,
                  paddingHorizontal: 40,
                  overflow: 'hidden',
                  backgroundColor: R.colors.primary,
                }}
              />
            </ImageBackground>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          useForeground
          onPress={() => this.props.navigation.navigate('Analytics')}>
          <View
            style={{
              backgroundColor: 'darkgrey',
              borderRadius: 5,
              overflow: 'hidden',
              marginBottom: 20,
            }}>
            <ImageBackground
              source={{
                uri:
                  'https://fstream.in/journal/home/home-analytics-mountain.webp',
              }}
              style={{
                padding: 20,
                paddingVertical: 40,
              }}>
              <Text style={{fontSize: 16, color: '#fff'}}>
                Track your progress
              </Text>
            </ImageBackground>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          useForeground
          onPress={() => this.props.navigation.navigate('Rewards')}>
          <View
            style={{
              backgroundColor: 'darkgrey',
              borderRadius: 5,
              overflow: 'hidden',
              marginBottom: 20,
            }}>
            <ImageBackground
              source={{
                uri:
                  'https://fstream.in/journal/home/home-achievements-trophy.webp',
              }}
              style={{
                padding: 20,
                paddingVertical: 40,
              }}>
              <Text style={{fontSize: 16, color: '#fff'}}>
                Your achievements
              </Text>
            </ImageBackground>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}
