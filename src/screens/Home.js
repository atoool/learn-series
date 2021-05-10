import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  StatusBar,
  TouchableNativeFeedback,
} from 'react-native';
import {HomePlayer} from '../comp/Home/HomePlayer';
import {HeadText} from '../comp/Home/HeadText';
import {LockedText} from '../comp/LockedText';
import {ListData} from '../comp/ListData';
import {SimpleList} from '../comp/SimpleList';
import {ContextStates} from '../func/ContextStates';
import Loading from '../comp/Loading';
import R from '../res/R';
import Animated from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RateUs from '../comp/RateUs';

export default class Home extends React.PureComponent {
  static contextType = ContextStates;
  state = {isPlay: false, data: [1, 2], focus: true};
  componentDidMount = () => {
    this.blur = this.props.navigation.addListener('blur', () => {
      StatusBar.setHidden(false);
      StatusBar.setBackgroundColor(R.colors.statusBar);
    });
    this.onNotification();
  };

  onNotification = () => {
    const {notific} = this.context;
    if (notific) {
      if (notific?.data && notific?.data?.course) {
        const {explore} = this.context.reduState;
        let data = null;
        explore &&
          (data = explore.filter(f => f.name === notific?.data?.course));
        data &&
          data.length !== 0 &&
          this.props.navigation.navigate('Plan', {
            data: data[0],
            type: 'explore',
          });
      } else {
        setTimeout(() => {
          notific.message &&
            notific.message === 'Scheduled' &&
            this.scrollRef &&
            this.scrollRef?.getNode()?.scrollTo({x: 0, y: 100, animated: true});
        }, 2000);
      }
    }
  };

  componentWillUnmount() {
    this.blur();
  }

  render() {
    const {reduState} = this.context;

    if (reduState.myCourse === null || reduState.mainVideo === null) {
      return <Loading load={this} />;
    }
    return (
      <Animated.ScrollView
        ref={re => (this.scrollRef = re)}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.cContainer}>
        <HomePlayer
          ref={re => (this.player = re)}
          vidData={reduState.mainVideo}
          that={this}
        />
        <View style={styles.cardView}>
          <HeadText title={R.locale.ready} caption={R.locale.caption} />
          <View style={styles.cardTouchView}>
            <TouchableNativeFeedback
              onPress={() => {
                const data = reduState.myCourse[0];
                this.props.navigation.navigate('Plan', {
                  data,
                  type: 'home',
                });
              }}
              style={styles.cardTouch}
              useForeground>
              <View style={styles.touchBox}>
                <ImageBackground
                  style={[styles.card]}
                  source={{
                    uri: reduState.myCourse[0].coverImage,
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
          <HeadText title={R.locale.myCourse} />
          {reduState.myCourse.map((itm, key) => (
            <View key={key}>
              <SimpleList data={itm} type="home" />
            </View>
          ))}
        </View>

        <View style={styles.cardView}>
          <HeadText title={R.locale.recom} />
          <ListData data={reduState.recomPlan} type="home" />
        </View>

        <RateUs isVisible={reduState.rateUs} />
      </Animated.ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {backgroundColor: R.colors.background, flex: 1},
  cContainer: {paddingBottom: hp(2.6)},
  cardView: {
    width: '100%',
    paddingTop: hp(3.9),
  },
  card: {
    borderRadius: hp(1.3),
    width: '100%',
    padding: hp(2.6),
    height: hp(25.6),
    backgroundColor: R.colors.img,
    overflow: 'hidden',
  },
  cardTextView: {
    position: 'absolute',
    bottom: hp(1.3),
    left: wp(2.8),
    backgroundColor: R.colors.background,
    borderRadius: hp(0.6),
    padding: hp(1.3),
  },
  cardText: {
    color: '#5e5a61',
    fontSize: hp(1.8),
    fontWeight: 'bold',
    marginBottom: hp(0.6),
  },
  cardSubText: {
    color: 'darkgrey',
    fontSize: hp(1.3),
    fontWeight: 'bold',
    marginBottom: hp(0.2),
  },
  cardTouchView: {paddingHorizontal: wp(5.6), width: '100%'},
  cardTouch: {width: '100%', height: '100%'},
  touchBox: {borderRadius: hp(1.3), overflow: 'hidden'},
});
