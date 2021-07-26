import React from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import Loading from './Loading';

export const PremSuccess = props => {
  const onChangeState = async () => {
    await AsyncStorage.multiSet([['@ONBOARDING', 'HIDE']])
      .then(() => {
        RNRestart.Restart();
      })
      .catch(e => {});
  };
  props?.that?.state?.purchasedPremium === 'success' && onChangeState();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Loading load={props.that} />
    </View>
  );
};
