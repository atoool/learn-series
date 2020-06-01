import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Icon} from 'react-native-elements';
import {Image} from 'react-native';
import {LockedText} from '../comp/LockedText';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {CommonActions, useNavigation} from '@react-navigation/native';

export const ListData = props => {
  const nav = useNavigation();
  return (
    <FlatList
      data={props.data}
      horizontal={props.vertical ? false : true}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={[styles.flatList, !props.small && {paddingTop: 10}]}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingBottom: props.vertical ? 150 : 10,
      }}
      numColumns={props.vertical ? 2 : 1}
      keyExtractor={(itm, index) => index.toString()}
      renderItem={({itm, index}) => (
        <View
          style={[
            {
              marginRight: index == props.data.length - 1 ? 0 : 10,
            },
            props.small && {width: 160},
          ]}
          key={index}>
          <TouchableNativeFeedback
            onPress={() => {
              nav.navigate('Plan');
            }}
            style={{padding: 5}}>
            <View>
              <Image
                source={require('../res/imgs/tent.jpg')}
                style={[styles.img, props.small && {width: 150}]}
              />
              <LockedText desc={props.desc} type={props.type} />
            </View>
          </TouchableNativeFeedback>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  flatList: {paddingTop: 20},
  img: {
    width: 180,
    height: 120,
    borderRadius: 5,
    marginBottom: 5,
  },
});
