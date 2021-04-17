import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import WebView from 'react-native-webview';
import {Button} from 'react-native-elements';
import {TouchableNativeFeedback} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TimeType} from '../func/TimeFunc';
import * as Animatable from 'react-native-animatable';
import {ImageBackground} from 'react-native';
import R from '../res/R';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';

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
    const dt = moment();
    return (
      <ScrollView
        style={{flex: 1, padding: hp(2.6), paddingTop: hp(12.8)}}
        contentContainerStyle={{paddingBottom: hp(12.8)}}>
        <Animatable.View
          style={{marginBottom: hp(3.9)}}
          // animation={this.state.pulse}
          // iterationCount={2}
          // easing="ease-in"
        >
          <Text
            style={{
              fontSize: hp(2.8),
              fontWeight: 'bold',
              color: R.colors.text,
            }}>
            {TimeType()}
          </Text>
          <Text
            style={{
              fontSize: hp(2.8),
              fontWeight: 'bold',
              color: R.colors.text,
            }}>
            {this.state.usr}
          </Text>
        </Animatable.View>
        <TouchableNativeFeedback
          useForeground
          onPress={() => this.props.navigation.navigate('DailyLog')}>
          <View
            style={{
              marginBottom: hp(2.6),
              backgroundColor: 'darkgrey',
              borderRadius: hp(0.6),
              overflow: 'hidden',
            }}>
            <ImageBackground
              source={{
                uri: 'https://fstream.in/journal/home/home-create-book.webp',
              }}
              style={{
                padding: hp(2.6),
                backgroundColor: R.colors.img,
              }}>
              <Text style={{fontSize: hp(2.1), color: '#fff'}}>
                {dt.format('dddd')}
              </Text>
              <Text
                style={{fontSize: hp(2.6), color: '#fff', fontWeight: 'bold'}}>
                {dt.format('MMMM')}
              </Text>
              <Text
                style={{fontSize: hp(2.6), color: '#fff', fontWeight: 'bold'}}>
                {dt.format('DD')}
              </Text>
              <Text
                style={{
                  fontSize: hp(2.1),
                  color: '#fff',
                  marginBottom: hp(7.7),
                }}>
                {R.locale.journal1}
              </Text>
              <Button
                onPress={() => {
                  this.props.navigation.navigate('DailyLog');
                }}
                title={R.locale.story}
                useForeground
                titleStyle={{fontSize: hp(1.7)}}
                containerStyle={{overflow: 'hidden', borderRadius: hp(2.6)}}
                buttonStyle={{
                  alignSelf: 'center',
                  borderRadius: hp(2.6),
                  paddingHorizontal: wp(11.11),
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
              borderRadius: hp(0.6),
              overflow: 'hidden',
              marginBottom: hp(2.6),
            }}>
            <ImageBackground
              source={{
                uri:
                  'https://fstream.in/journal/home/home-analytics-mountain.webp',
              }}
              style={{
                padding: hp(2.6),
                paddingVertical: hp(5.1),
                backgroundColor: R.colors.img,
              }}>
              <Text style={{fontSize: hp(2.1), color: '#fff'}}>
                {R.locale.journal2}
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
              borderRadius: hp(0.6),
              overflow: 'hidden',
              marginBottom: hp(2.6),
            }}>
            <ImageBackground
              source={{
                uri:
                  'https://fstream.in/journal/home/home-achievements-trophy.webp',
              }}
              style={{
                padding: hp(2.6),
                paddingVertical: hp(5.1),
                backgroundColor: R.colors.img,
              }}>
              <Text style={{fontSize: hp(2.1), color: '#fff'}}>
                {R.locale.journal3}
              </Text>
            </ImageBackground>
          </View>
        </TouchableNativeFeedback>
      </ScrollView>
    );
  }
}
