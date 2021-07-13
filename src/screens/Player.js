import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {CommonWeb} from '../comp/CommonWeb';

export const Player = ({route}) => {
  const {lurl = 'Creamy Mushrooms'} = route?.params;

  const onResponse = ({url}) => {
    if (url?.indexOf('/checkVideoFav/') > -1) {
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonWeb
        page={'article/playUnified'}
        params={`&lurl=${lurl}&rstream&videos&backstack=true`}
        onResponse={onResponse}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});
