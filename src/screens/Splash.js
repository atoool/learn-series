import React from 'react';
import {StyleSheet, Image, View, StatusBar, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from '../comp/Loading';
import RateUs from '../comp/RateUs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class Splash extends React.PureComponent {
  state = {
    rateUs: false,
  };
  componentDidMount = async () => {
    const initApp = await AsyncStorage.multiGet([
      '@ONBOARDING',
      'rateus',
    ]).catch(e => {});

    if (initApp)
      Platform.OS === 'ios'
        ? this.redirect(initApp)
        : setTimeout(() => {
            this.redirect(initApp);
          }, 3000);
  };
  redirect = initApp => {
    if (initApp[0][1] == 'HIDE') this.props.navigation.replace('MainTab');
    else this.props.navigation.replace('MainTab');
    if (initApp[1][1] != null && initApp[1][1] == '2nd')
      this.setState({rateUs: true});
  };

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'iOS' ? (
          <Loading load={this} />
        ) : (
          <Image style={styles.img} source={require('../res/imgs/logo.png')} />
        )}
        {this.state.rateUs && <RateUs isVisible={this.state.rateUs} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: hp(10.3),
    height: hp(10.23),
    marginBottom: hp(2.6),
  },
});
