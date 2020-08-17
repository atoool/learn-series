import React, {useContext, useEffect, useState} from 'react';
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
import {checkPurchased} from './PremiumCheckFun';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const ListData = props => {
  const context = useContext(ContextStates);
  const nav = useNavigation();
  const [premiumPurchased, setPremium] = useState(false);
  useEffect(() => {
    async function premiumCheck() {
      const premium = await checkPurchased();
      setPremium(premium);
    }
    premiumCheck();
  }, []);
  return (
    <FlatList
      data={props.data}
      horizontal={props.vertical ? false : true}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={[styles.flatList, !props.small && {paddingTop: hp(1.3)}]}
      contentContainerStyle={{
        paddingHorizontal: wp(4.2),
        paddingBottom: props.vertical ? hp(19.2) : 10,
      }}
      numColumns={props.vertical ? 2 : 1}
      keyExtractor={(itm, index) => index.toString()}
      renderItem={({item, index}) => (
        <View
          key={index}
          style={[
            {
              marginRight: index == props.data.length - 1 ? 0 : wp(2.8),
              overflow: 'hidden',
              borderRadius: hp(0.6),
            },
            props.small && {width: wp(44.44)},
          ]}>
          <TouchableNativeFeedback
            onPress={() => {
              props.scroll &&
                props.scroll.refs.scrollRef
                  ?.getNode()
                  ?.scrollTo({x: 0, y: 0, animated: true});
              props.scroll && props.scroll.onMount();

              nav.navigate('Plan', {data: item, type: props.type});
            }}
            style={{padding: hp(0.6)}}
            useForeground>
            <View>
              <ImageBackground
                source={{
                  uri: context.reduState.imgHome[item.coverImage],
                }}
                style={[styles.img, props.small && {width: wp(41.7)}]}>
                {!premiumPurchased && item?.premium && (
                  <>
                    <Gradient
                      start={{x: 0, y: 1}}
                      end={{x: 0, y: 0}}
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                      style={{flex: 1, borderRadius: hp(0.6)}}
                    />
                    <PremiumTag />
                  </>
                )}
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
  flatList: {paddingTop: hp(2.6)},
  img: {
    width: hp(23.1),
    height: hp(15.4),
    borderRadius: hp(0.6),
    marginBottom: hp(0.6),
    overflow: 'hidden',
  },
});
