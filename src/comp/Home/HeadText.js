import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const HeadText = props => {
  return (
    <View style={styles.container}>
      <Text style={[styles.head, props.type === 'sleep' && {color: '#a3aeeb'}]}>
        {props.title}
      </Text>
      {props.caption && <Text style={styles.subHead}>{props.caption}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: wp(5.6),
  },
  head: {
    color: '#5e5a61',
    fontSize: wp(4.44),
    fontWeight: 'bold',
    marginBottom: hp(0.6),
  },
  subHead: {
    color: 'darkgrey',
    fontSize: wp(3.33),
    fontWeight: 'bold',
    marginBottom: hp(1.9),
  },
});
