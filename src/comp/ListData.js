import React, {useContext} from 'react';
import {View, Text, StyleSheet, FlatList, ImageBackground} from 'react-native';
import {Icon} from 'react-native-elements';
import {Image} from 'react-native';
import {LockedText} from '../comp/LockedText';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {CommonActions, useNavigation} from '@react-navigation/native';
import R from '../res/R';
import {ContextStates} from '../func/ContextStates';
import Gradient from 'react-native-linear-gradient';
import PremiumTag from './PremiumTag';

export const ListData = props => {
  const context = useContext(ContextStates);
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
              props.scroll && props.scroll();
              nav.navigate('Plan', {data: item, type: props.type});
            }}
            style={{padding: 5}}
            useForeground>
            <View>
              <ImageBackground
                source={{
                  uri: context.reduState.imgHome[item.coverImage],
                }}
                style={[styles.img, props.small && {width: 150}]}>
                <Gradient
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: 0}}
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                  style={{flex: 1, borderRadius: 5}}
                />
                <PremiumTag />
              </ImageBackground>
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
    overflow: 'hidden',
  },
});
