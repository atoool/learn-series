import React from 'react';
import {View, Text, ScrollView} from 'react-native';
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
import {StyleSheet} from 'react-native';

export default class Jounal extends React.PureComponent {
  state = {usr: '', pulse: 'pulse', lang: 'en'};
  componentDidMount = async () => {
    this.focus = this.props.navigation.addListener('focus', async () => {
      const usr = await AsyncStorage.multiGet(['username', 'lang']).catch(
        e => {},
      );
      this.setState({usr: usr[0][1], pulse: 'pulse', lang: usr[1][1]});
    });
    this.blur = this.props.navigation.addListener('blur', async () => {
      this.setState({pulse: 'slideInDown'});
    });
  };
  componentWillUnmount = () => {
    this.focus();
    this.blur();
  };

  goTo = val => {
    const nav = ['DailyLog', 'Analytics', 'Rewards'];
    this.props.navigation.navigate(nav[val]);
  };

  render() {
    const dt = moment();
    const arr = [
      {
        uri: 'https://fstream.in/journal/home/home-create-book.webp',
        mainCard: true,
        text: R.locale.journal1,
      },
      {
        uri: 'https://fstream.in/journal/home/home-analytics-mountain.webp',
        mainCard: false,
        text: R.locale.journal2,
      },
      {
        uri: 'https://fstream.in/journal/home/home-achievements-trophy.webp',
        mainCard: false,
        text: R.locale.journal3,
      },
    ];
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <Animatable.View style={styles.animatedBox}>
          <Text style={styles.greetText}>{TimeType()}</Text>
          <Text style={styles.username}>{this.state.usr}</Text>
        </Animatable.View>
        {arr.map((itm, indx) => (
          <TouchableNativeFeedback
            key={indx}
            useForeground
            onPress={() => this.goTo(indx)}>
            <View style={styles.touchBox}>
              <ImageBackground source={{uri: itm.uri}} style={styles.img}>
                {itm.mainCard && (
                  <>
                    <Text style={styles.day}>{dt.format('dddd')}</Text>
                    <Text style={styles.date}>{dt.format('MMMM')}</Text>
                    <Text style={styles.date}>{dt.format('DD')}</Text>
                  </>
                )}
                <Text
                  style={[
                    styles.cardText,
                    itm.mainCard && styles.marginBottom,
                  ]}>
                  {itm.text}
                </Text>
                {itm.mainCard && (
                  <Button
                    onPress={() => this.goTo(indx)}
                    title={R.locale.story}
                    useForeground
                    titleStyle={{fontSize: hp(1.7)}}
                    containerStyle={styles.buttonContainer}
                    buttonStyle={styles.buttonStyle}
                  />
                )}
              </ImageBackground>
            </View>
          </TouchableNativeFeedback>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: hp(2.6), paddingTop: hp(12.8)},
  contentContainer: {paddingBottom: hp(12.8)},
  greetText: {
    fontSize: hp(2.8),
    fontWeight: 'bold',
    color: R.colors.text,
  },
  animatedBox: {marginBottom: hp(3.9)},
  username: {
    fontSize: hp(2.8),
    fontWeight: 'bold',
    color: R.colors.text,
  },
  touchBox: {
    marginBottom: hp(2.6),
    backgroundColor: 'darkgrey',
    borderRadius: hp(0.6),
    overflow: 'hidden',
  },
  cardText: {
    fontSize: hp(2.1),
    color: '#fff',
  },
  img: {
    padding: hp(2.6),
    backgroundColor: R.colors.img,
    minHeight: hp(14),
    justifyContent: 'center',
  },
  day: {fontSize: hp(2.1), color: '#fff'},
  date: {fontSize: hp(2.6), color: '#fff', fontWeight: 'bold'},
  buttonContainer: {overflow: 'hidden', borderRadius: hp(2.6)},
  buttonStyle: {
    alignSelf: 'center',
    borderRadius: hp(2.6),
    paddingHorizontal: wp(11.11),
    overflow: 'hidden',
    backgroundColor: R.colors.primary,
  },
  marginBottom: {marginBottom: hp(7.7)},
});
