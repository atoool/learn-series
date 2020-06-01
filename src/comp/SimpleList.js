import React from 'react';
import {View, StyleSheet, Image, TouchableNativeFeedback} from 'react-native';
import {Icon} from 'react-native-elements';
import {LockedText} from '../comp/LockedText';
import {useNavigation} from '@react-navigation/native';

export const SimpleList = props => {
  const nav = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <TouchableNativeFeedback
        onPress={() => {
          nav.navigate('Plan');
        }}>
        <View style={styles.container}>
          <Image source={require('../res/imgs/tent.jpg')} style={styles.img} />
          <LockedText type={props.type ? props.type : ''} />
          <Icon
            name="keyboard-arrow-right"
            color={props.type === 'sleep' ? '#a3aeeb' : 'grey'}
            size={30}
            containerStyle={styles.icon}
          />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {width: '100%', paddingHorizontal: 15},
  container: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
    padding: 5,
  },
  img: {width: 80, height: 80, borderRadius: 5, marginRight: 10},
  icon: {right: 0, position: 'absolute'},
});
