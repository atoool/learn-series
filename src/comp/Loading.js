import React, {PureComponent} from 'react';
import {
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  View,
} from 'react-native';
import R from '../res/R';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {StyleSheet} from 'react-native';
export default class Loading extends PureComponent {
  state = {refresh: false};

  onRefresh = () => {
    this.setState({refresh: true});
    setTimeout(() => {
      this.setState({refresh: false});
      this.props.load.setState({load: true});
    }, 2000);
  };
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={
                (this.props.load.state.load === false &&
                  this.props.load.setState({load: true}),
                () => this.onRefresh())
              }
            />
          }>
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
