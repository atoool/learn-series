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
  componentDidMount = () => {
    this.focus = this.props.navigation.addListener('focus', async () => {});
    this.blur = this.props.navigation.addListener('blur', () => {});
  };

  componentWillUnmount() {
    this.focus();
    this.blur();
  }

  render() {
    const {reduState} = this.context;

    if (reduState.myCourse == null || reduState.mainVideo == null)
      return <Loading load={this} />;
    return (
      // <ContextStates.Consumer>
      //   {() => {
      //     return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.constainer}
        contentContainerStyle={styles.cContainer}>
        <StatusBar hidden translucent />
        <HomePlayer vidData={reduState.mainVideo} that={this} />
        {/* <View style={[styles.cardView]}>
          <HeadText
            title="Today's Meditation"
            caption="Try 2 sessions for free"
          />
          <SmallCard nav={() => this.props.navigation.navigate('Plan')} />
        </View> */}

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
                const data = reduState.myCourse[0];
                this.props.navigation.navigate('Plan', {
                  data,
                });
              }}
              style={{width: '100%', height: '100%'}}
              useForeground>
              <View style={{borderRadius: 10, overflow: 'hidden'}}>
                <ImageBackground
                  style={[styles.card]}
                  source={{
                    uri: isNaN(reduState.myCourse.reverse()[0].coverImage)
                      ? reduState.myCourse.reverse()[0].coverImage
                      : R.strings.defaultImg,
                  }}>
                  <View style={styles.cardTextView}>
                    <LockedText
                      type={''}
                      locked={false}
                      title={reduState.myCourse.reverse()[0].name.toUpperCase()}
                      desc={''}
                      lessons={`${
                        reduState.session.reverse()[0].lesson
                          ? reduState.session.reverse()[0].lesson
                          : 1
                      } OF ${reduState.myCourse.reverse()[0].lessons.length}`}
                    />
                  </View>
                </ImageBackground>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>

        <View style={styles.cardView}>
          <HeadText title="My courses" />
          {reduState.myCourse.reverse().map((itm, key) => (
            <View key={key}>
              <SimpleList data={itm} />
            </View>
          ))}
        </View>

        <View style={styles.cardView}>
          <HeadText title="Recommended for you" />
          <ListData data={reduState.recomPlan} />
        </View>
        {/* <View style={styles.cardView}>
          <HeadText title="Recent" />
          <ListData data={this.state.data} />
        </View> */}
      </ScrollView>
      //     );
      //   }}
      // </ContextStates.Consumer>
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
