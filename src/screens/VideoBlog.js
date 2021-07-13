import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {CommonWeb} from '../comp/CommonWeb';

export const VideoBlog = ({navigation}) => {
  const onResponse = ({url}) => {
    if (url?.indexOf('/premium') > -1) {
      navigation.navigate('Premium');
    } else if (url?.indexOf('/videoCategory') > -1) {
      let lurl = url?.split('/');
      lurl = lurl ? lurl[lurl?.length - 1] : null;
      navigation.navigate('Player', {lurl});
    }
    return false;
  };
  return (
    <SafeAreaView style={styles.container}>
      <CommonWeb
        page={'article/videohome'}
        params={'&data=1&diet=app&catlimit=21&android&n2021'}
        onResponse={onResponse}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});
