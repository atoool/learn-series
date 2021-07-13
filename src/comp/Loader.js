import React, {PureComponent} from 'react';
import {ScrollView, ActivityIndicator, View, StyleSheet} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import R from '../res/R';

export default class Loading extends PureComponent {
  state = {refresh: false};

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ActivityIndicator
            size={heightPercentageToDP(4)}
            color={R.colors.primary}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: R.colors.background,
  },
  scroll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
