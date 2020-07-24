import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  View,
} from 'react-native';
import R from '../res/R';

export default class Loading extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {refresh: false};
  }

  onRefresh = () => {
    this.setState({refresh: true});
    setTimeout(() => {
      this.setState({refresh: false});
      this.props.load.setState({load: true});
    }, 2000);
  };
  render() {
    return (
      <View
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          backgroundColor: '#fff',
        }}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
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
          <ActivityIndicator size={30} color={R.colors.primary} />
        </ScrollView>
      </View>
    );
  }
}
