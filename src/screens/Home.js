import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {HomePlayer} from '../comp/Home/HomePlayer';
import {HeadText} from '../comp/Home/HeadText';
import {SmallCard} from '../comp/SmallCard';
import {LockedText} from '../comp/LockedText';
import Canvas from 'react-native-canvas';
import WebView from 'react-native-webview';
import {Icon} from 'react-native-elements';
import {ListData} from '../comp/ListData';
import {SimpleList} from '../comp/SimpleList';
import {ContextStates} from '../func/ContextStates';

export default class Home extends React.PureComponent {
  state = {isPlay: false, data: [1, 2, 3, 4, 5, 6]};
  componentDidMount = () => {};
  render() {
    const {isPlay} = this.state;
    return (
      <ContextStates.Consumer>
        {({loader}) => {
          if (loader)
            return <View style={{flex: 1, backgroundColor: '#000'}} />;
          return (
            <ScrollView
              style={styles.constainer}
              contentContainerStyle={styles.cContainer}>
              <HomePlayer />
              <View style={[styles.cardView]}>
                <HeadText
                  title="Today's Meditation"
                  caption="Try 2 sessions for free"
                />
                <SmallCard nav={() => this.props.navigation.navigate('Plan')} />
              </View>

              <View style={styles.cardView}>
                <HeadText
                  title="Ready to begin?"
                  caption="Start your journey with session 1 of the Basics"
                />
                <View style={{paddingHorizontal: 20, width: '100%'}}>
                  <View style={styles.card}>
                    <View style={styles.cardTextView}>
                      <LockedText />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.cardView}>
                <HeadText title="My courses" />
                <SimpleList />
                <SimpleList />
              </View>

              <View style={styles.cardView}>
                <HeadText title="Recommended for you" />
                <ListData data={this.state.data} />
              </View>
              <View style={styles.cardView}>
                <HeadText title="Recent" />
                <ListData data={this.state.data} />
              </View>
            </ScrollView>
          );
        }}
      </ContextStates.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  constainer: {flex: 1},
  cContainer: {paddingBottom: 20},
  cardView: {
    width: '100%',
    paddingTop: 30,
  },
  card: {
    borderRadius: 10,
    width: '100%',
    padding: 20,
    height: 200,
    backgroundColor: '#fbeee0',
  },
  cardTextView: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
  cardText: {
    color: '#5e5a61',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubText: {
    color: 'darkgrey',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
});
