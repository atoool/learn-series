import * as React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import R from '../res/R';

export default (PremiumTag = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('../res/imgs/prem.png')} />
      <Text style={styles.txt}>PREMIUM</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    top: hp(2),
    alignItems: 'center',
    backgroundColor: R.colors.primary,
    paddingHorizontal: hp(1.3),
    paddingVertical: hp(0.6),
    borderTopRightRadius: hp(0.6),
    borderBottomRightRadius: hp(0.6),
  },
  img: {
    width: hp(1.5),
    height: hp(1.5),
    tintColor: '#fff',
  },
  txt: {
    marginLeft: hp(0.6),
    color: '#fff',
    fontSize: hp(1.3),
    fontFamily: R.fonts.text,
  },
});
