import React from 'react';
import LottieView from 'lottie-react-native';
import {View, ActivityIndicator} from 'react-native';
import success from '../res/success.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import R from '../res/R';
import RNRestart from 'react-native-restart';
import Loading from './Loading';
// import NotificationService from './NotificationService';

export const PremSuccess = props => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {props.that.state.purchasedPremium === 'yup' ? (
        <Loading load={props.that} />
      ) : (
        props.that.state.purchasedPremium === 'success' && (
          <LottieView
            source={success}
            autoPlay
            style={{
              width: hp(15.4),
              height: hp(15.4),
            }}
            onAnimationFinish={async () => {
              await AsyncStorage.multiSet([['@ONBOARDING', 'HIDE']])
                .then(() => {
                  RNRestart.Restart();
                })
                .catch(e => {});
            }}
            loop={false}
          />
        )
      )}
    </View>
  );
};
