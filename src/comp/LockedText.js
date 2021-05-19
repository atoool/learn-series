import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import R from '../res/R';

export const LockedText = props => {
  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        {props.locked && <Icon name="lock" color="#5e5a61" />}
        <Text
          style={[
            styles.cardTitle,
            props.type === 'sleep' && {color: '#9ea8e7'},
          ]}>
          {props.title}
        </Text>
      </View>
      <Text
        style={[
          styles.cardSubTitle,
          props.type === 'sleep' && {color: '#6267a8'},
        ]}>
        {props.lessons} {R.locale.lessons}
      </Text>
      {props.desc?.length != 0 && (
        <Text
          style={[styles.desc, props.type === 'sleep' && {color: '#6267a8'}]}>
          {props.desc}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    color: '#5e5a61',
    fontSize: hp(1.7),
    fontWeight: 'bold',
    marginBottom: hp(0.6),
  },
  cardSubTitle: {
    color: 'darkgrey',
    fontSize: hp(1.3),
    fontWeight: 'bold',
    marginBottom: hp(0.2),
  },
  desc: {color: 'grey', fontSize: hp(1.5)},
});
