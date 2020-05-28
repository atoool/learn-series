import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {Card, Icon, Button} from 'react-native-elements';
import R from '../res/R';
import {ListData} from '../comp/ListData';

const {height, width} = Dimensions.get('window');

export default class ExploreFList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [1, 2, 3, 4, 5, 6],
    };
  }

  render() {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor:
              this.props.route.params.type === 'sleep' ? '#1e265f' : '#fff',
          },
        ]}>
        <View
          style={[
            {
              flexDirection: 'row',
              height: 80,
              width: '100%',
              backgroundColor: '#ddd',
              alignItems: 'center',
              paddingTop: 25,
              elevation: 5,
            },
            {
              backgroundColor:
                this.props.route.params.type === 'sleep' ? '#1e265f' : '#fff',
            },
          ]}>
          <Button
            icon={{
              name: 'keyboard-backspace',
              color:
                this.props.route.params.type === 'sleep' ? '#a3aeeb' : '#000',
            }}
            onPress={() => this.props.navigation.goBack()}
            containerStyle={{width: '15%'}}
            buttonStyle={{backgroundColor: 'rgba(0,0,0,0)'}}
          />
          <Text
            style={{
              fontSize: 20,
              textAlignVertical: 'center',
              textAlign: 'center',
              width: '70%',
              zIndex: 1,
              color:
                this.props.route.params.type === 'sleep' ? '#a3aeeb' : '#000',
              fontWeight: 'bold',
            }}>
            {this.props.route.params.title}
          </Text>
        </View>
        <View style={styles.cardView}>
          <ListData
            data={this.props.route.params.data}
            small
            type={this.props.route.params.type}
            desc="Recognize what's occupying your mind and let it go."
            vertical
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardView: {
    width: '100%',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
  },
});
