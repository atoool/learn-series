import React from 'react';
import {View, StyleSheet, Image, TouchableNativeFeedback} from 'react-native';
import {Icon} from 'react-native-elements';
import {LockedText} from '../comp/LockedText';
import {useNavigation} from '@react-navigation/native';
import R from '../res/R';
import {useContext} from 'react';
import {ContextStates} from '../func/ContextStates';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const SimpleList = ({data, type, playerPause}) => {
  const nav = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <TouchableNativeFeedback
        onPress={() => {
          nav.navigate('Plan', {data, type});
        }}
        useForeground>
        <View style={styles.container}>
          <Image
            source={{
              uri: data.coverImage,
            }}
            style={styles.img}
          />
          <LockedText
            type={type ? type : ''}
            locked={false}
            title={data?.name}
            lessons={data?.lessons.length}
            desc={''}
          />
          <Icon
            name="keyboard-arrow-right"
            color={type === 'sleep' ? '#a3aeeb' : 'grey'}
            size={hp(3.9)}
            containerStyle={styles.icon}
          />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {width: '100%', paddingHorizontal: wp(4.2)},
  container: {
    flexDirection: 'row',
    marginTop: hp(1.3),
    alignItems: 'center',
    width: '100%',
    padding: hp(0.6),
    overflow: 'hidden',
    borderRadius: hp(0.6),
  },
  img: {
    width: hp(10.3),
    height: hp(10.3),
    borderRadius: hp(0.6),
    marginRight: wp(2.8),
    backgroundColor: R.colors.img,
  },
  icon: {right: 0, position: 'absolute'},
});
