import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import {LockedText} from '../comp/LockedText';

export const SimpleList = props => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Image source={require('../res/imgs/tent.jpg')} style={styles.img} />
        <LockedText />
        <Icon
          name="keyboard-arrow-right"
          color="grey"
          size={30}
          containerStyle={styles.icon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {width: '100%', paddingHorizontal: 20},
  container: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  img: {width: 80, height: 80, borderRadius: 5, marginRight: 10},
  icon: {right: 0, position: 'absolute'},
});
