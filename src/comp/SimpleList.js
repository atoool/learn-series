import React from 'react';
import {View, StyleSheet, Image, TouchableNativeFeedback} from 'react-native';
import {Icon} from 'react-native-elements';
import {LockedText} from '../comp/LockedText';
import {useNavigation} from '@react-navigation/native';
import R from '../res/R';
import {useContext} from 'react';
import {ContextStates} from '../func/ContextStates';

export const SimpleList = ({data, type, playerPause}) => {
  const context = useContext(ContextStates);
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
              uri:
                type == 'home'
                  ? context.reduState.imgHome[data.coverImage]
                  : type == 'explore'
                  ? context.reduState.imgExplore[data.coverImage]
                  : context.reduState.imgSleep[data.coverImage],
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
