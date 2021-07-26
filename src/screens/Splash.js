import React from 'react';
import {StyleSheet, Image, View, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../comp/Loading';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {ContextStates} from '../func/ContextStates';
import R from '../res/R';

export default class Splash extends React.PureComponent {
  static contextType = ContextStates;
  state = {
    rateUs: false,
  };
  componentDidMount = async () => {
    const initApp = await AsyncStorage.multiGet([
      '@ONBOARDING',
      'rateus',
      'langSaw',
    ]).catch(e => {});

    if (initApp)
      Platform.OS === 'ios'
        ? this.redirect(initApp)
        : setTimeout(() => {
            this.redirect(initApp);
          }, 3000);
  };
  redirect = initApp => {
    if (!initApp[2][1]) {
      this.props.navigation.replace('Language');
    } else if (!initApp[0][1]) {
      this.context?.reduState?.premiumPurchased
        ? this.props.navigation.replace('ChangePrefs')
        : this.props.navigation.replace('Onboarding');
    } else {
      this.props.navigation.replace('MainTab');
    }

    initApp[1][1] != null &&
      initApp[1][1] == '2nd' &&
      this.context.dispatch({type: 'rateus', payload: true});
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          {Platform.OS === 'iOS' ? (
            <Loading load={this} />
          ) : (
            <Image
              style={styles.img}
              source={require('../res/imgs/logo.png')}
            />
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: R.colors.background,
  },
  img: {
    width: hp(10.3),
    height: hp(10.23),
    marginBottom: hp(2.6),
  },
});
