import React from 'react';
import {View, StyleSheet, Image, TouchableNativeFeedback} from 'react-native';
import {Icon} from 'react-native-elements';
import {LockedText} from '../comp/LockedText';
import {useNavigation} from '@react-navigation/native';
import R from '../res/R';

export const SimpleList = ({data, type}) => {
  const nav = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <TouchableNativeFeedback
        onPress={() => {
          nav.navigate('Plan', {data, chapter: 1, lesson: 1});
        }}
        useForeground>
        <View style={styles.container}>
          <Image
            source={{
              uri: isNaN(data?.coverImage)
                ? data.coverImage
                : R.strings.defaultImg,
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
    overflow: 'hidden',
    borderRadius: 5,
  },
  img: {width: 80, height: 80, borderRadius: 5, marginRight: 10},
  icon: {right: 0, position: 'absolute'},
});
