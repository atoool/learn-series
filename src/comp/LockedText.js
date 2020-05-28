import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';

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
          Basics
        </Text>
      </View>
      <Text
        style={[
          styles.cardSubTitle,
          props.type === 'sleep' && {color: '#6267a8'},
        ]}>
        3-20 MIN MEDITATION
      </Text>
      {props.desc && (
        <Text
          style={[styles.desc, props.type === 'sleep' && {color: '#6267a8'}]}>
          Start to deepen your practice.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    color: '#5e5a61',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubTitle: {
    color: 'darkgrey',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  desc: {color: 'grey', fontSize: 12},
});
