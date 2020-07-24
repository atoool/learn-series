import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Icon} from 'react-native-elements';
import {Image} from 'react-native';
import {LockedText} from '../comp/LockedText';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {CommonActions, useNavigation} from '@react-navigation/native';
import R from '../res/R';

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
      renderItem={({item, index}) => (
        <View
          key={index}
          style={[
            {
              marginRight: index == props.data.length - 1 ? 0 : 10,
              overflow: 'hidden',
              borderRadius: 5,
            },
            props.small && {width: 160},
          ]}>
          <TouchableNativeFeedback
            onPress={() => {
              nav.navigate('Plan', {data: item, chapter: 1, lesson: 1});
            }}
            style={{padding: 5}}
            useForeground>
            <View>
              <Image
                source={{
                  uri: isNaN(item.coverImage)
                    ? item.coverImage
                    : R.strings.defaultImg,
                }}
                style={[styles.img, props.small && {width: 150}]}
              />
              <LockedText
                title={item.name}
                lessons={item.lessons.length}
                desc={item.desc}
                type={props.type}
              />
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
