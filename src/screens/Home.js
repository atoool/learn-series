import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  StatusBar,
  TouchableNativeFeedback,
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
import Loading from '../comp/Loading';
import R from '../res/R';

export default class Home extends React.PureComponent {
  static contextType = ContextStates;
  state = {isPlay: false, data: [1, 2], focus: true};
  componentDidMount = () => {};

  componentWillUnmount() {}

  render() {
    const {reduState} = this.context;

    if (reduState.myCourse == null || reduState.mainVideo == null)
      return <Loading load={this} />;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.constainer}
        contentContainerStyle={styles.cContainer}>
        <StatusBar hidden translucent />
        <HomePlayer
          ref={re => (this.player = re)}
          vidData={reduState.mainVideo}
          that={this}
        />
        <View style={styles.cardView}>
          <HeadText
            title="Ready to begin?"
            caption={`Keep your journey with lesson ${
              reduState.session[0].lesson
            }`}
          />
          <View style={{paddingHorizontal: 20, width: '100%'}}>
            <TouchableNativeFeedback
              onPress={() => {
                this.player.playerPause();
                const data = reduState.myCourse[0];
                this.props.navigation.navigate('Plan', {
                  data,
                  type: 'home',
                });
              }}
              style={{width: '100%', height: '100%'}}
              useForeground>
              <View style={{borderRadius: 10, overflow: 'hidden'}}>
                <ImageBackground
                  style={[styles.card]}
                  source={{
                    uri: reduState.imgHome[reduState.myCourse[0].coverImage],
                  }}>
                  <View style={styles.cardTextView}>
                    <LockedText
                      type={''}
                      locked={false}
                      title={reduState.myCourse[0].name.toUpperCase()}
                      desc={''}
                      lessons={`${
                        reduState.session[0].lesson
                          ? reduState.session[0].lesson
                          : 1
                      } OF ${reduState.myCourse[0].lessons.length}`}
                    />
                  </View>
                </ImageBackground>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>

        <View style={styles.cardView}>
          <HeadText title="My courses" />
          {reduState.myCourse.map((itm, key) => (
            <View key={key}>
              <SimpleList
                playerPause={this.player?.playerPause}
                data={itm}
                type="home"
              />
            </View>
          ))}
        </View>

        <View style={styles.cardView}>
          <HeadText title="Recommended for you" />
          <ListData
            playerPause={this.player?.playerPause}
            data={reduState.recomPlan}
            type="home"
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  constainer: {backgroundColor: '#fff', flex: 1},
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
    overflow: 'hidden',
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
