import React from 'react';
import {
  NativeModules,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Text,
  StatusBar,
  Dimensions,
  BackHandler,
  Animated,
  Easing,
} from 'react-native';
import {Icon, Button, Slider} from 'react-native-elements';
import Orientation from 'react-native-orientation';
import LinearGradient from 'react-native-linear-gradient';
import GestureRecognizer from 'react-native-swipe-gestures';
import Swiper from 'react-native-swiper';
import {TouchableWithoutFeedback} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  listenOrientationChange,
} from 'react-native-responsive-screen';
import {ContextStates} from '../func/ContextStates';
import YouTube from 'react-native-youtube';
import LottieView from 'lottie-react-native';
import YoutubePlayer, {getYoutubeMeta} from 'react-native-youtube-iframe';
import WebView from 'react-native-webview';
import R from '../res/R';

const {width, height} = Dimensions.get('window');

function fmtMSS(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
}
const LinearGr = Animated.createAnimatedComponent(LinearGradient);

const Swipr = Animated.createAnimatedComponent(Swiper);
export default class Player extends React.PureComponent {
  static contextType = ContextStates;
  constructor(props) {
    super(props);
    this.animated = new Animated.Value(0);
    this.animSwipe = new Animated.Value(0);
    this.state = {
      play: true,
      fullScreen: true,
      close: false,
      currentTime: 0,
      totalTime: 0,
      crntVideo: '',
      swipeIndex: 0,
      buffering: true,
      loader: true,
      chapter: 1,
      lesson: 1,
      enableSwipe: false,
      title: '',
      completed: false,
      lessons: 1,
    };
  }
  componentDidMount() {
    StatusBar.setHidden(true);
    StatusBar.setTranslucent(true);
    Orientation.lockToLandscape();
    const session = this.context.reduState.session[0];
    const chapter = session.chapter;
    const lesson = session.lesson;

    this.setState({
      chapter,
      lesson,
      swipeIndex: this.props.route.params.playIndex,
    });
    setTimeout(() => {
      this.setState({loader: false});
    }, 1000);
    // this.back = BackHandler.addEventListener('hardwareBackPress', () => {
    //   return true;
    // });
  }

  timeOutFunc = () => {
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.setState({close: true});
    }, 4000);
  };

  componentWillUnmount = () => {
    clearTimeout(this.timeOut);
    clearInterval(this.interval);
    Orientation.lockToPortrait();
    // this.back.remove();
  };

  triggerControls = hide => {
    clearTimeout(this.hideControl);
    !hide &&
      Animated.timing(this.animated, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
    hide &&
      (this.hideControl = setTimeout(() => {
        Animated.timing(this.animated, {
          toValue: this.state.play ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 1500));
  };

  triggerSwipe = (show, ignore) => {
    clearTimeout(this.hideSwipe);
    Animated.timing(this.animSwipe, {
      toValue: show == 'false' ? 0 : 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.cubic,
    }).start();
    clearInterval(this.interval);
    !ignore &&
      show == 'false' &&
      this.props.route.params.videos.length - 1 !== this.state.swipeIndex &&
      this.refSwipe.scrollTo(this.state.swipeIndex + 1, true);
    // this.hideSwipe = setTimeout(() => {
    //   Animated.timing(this.animSwipe, {
    //     toValue: 0,
    //     duration: 500,
    //     useNativeDriver: true,
    //     easing: Easing.cubic,
    //   }).start();

    //   clearInterval(this.interval);
    // }, 1500);
  };

  saveIndex = async () => {
    let {swipeIndex, chapter, lesson} = this.state;
    const {type, videos, lessons} = this.props.route.params;
    if (chapter - 1 <= swipeIndex && type != 'random' && lessons != lesson) {
      chapter = swipeIndex + 1;
      lesson = this.state.lesson;
      if (swipeIndex == videos.length - 1 && lessons != lesson) {
        lesson = this.state.lesson + 1;
        chapter = 1;
      }
      this.setState({chapter, lesson});
      let session =
        type === 'sleep'
          ? this.context.reduState.sleepPr
          : this.context.reduState.session;
      session[type === 'sleep' ? session.length - 1 : 0].chapter = chapter;
      session[type === 'sleep' ? session.length - 1 : 0].lesson = lesson;
      await this.context.dispatch({
        type: type === 'sleep' ? 'sleepSess' : 'session',
        payload: [...session],
      });
    }
  };

  async final() {
    await this.saveIndex();
    this.props.navigation.goBack();
  }

  render() {
    const {play, buffering, swipeIndex, completed} = this.state;
    const {videos, type} = this.props.route.params;
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    const rTime = Math.abs(this.state.totalTime - this.state.currentTime) / 60;

    const transY1 = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -100],
    });
    const transY2 = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 120],
    });

    const translateX = this.animSwipe.interpolate({
      inputRange: [0, 1],
      outputRange: [200, 0],
    });

    return (
      <ContextStates.Consumer>
        {({playVideo}) => {
          if (this.state.loader)
            return <View style={{flex: 1, backgroundColor: '#000'}} />;

          return (
            <View style={{height: '100%', width: '100%'}}>
              <Swiper
                ref={re => {
                  this.refSwipe = re;
                }}
                showsButtons={false}
                index={this.state.swipeIndex}
                loop={false}
                onIndexChanged={i => {
                  clearInterval(this.interval);
                  this.setState(
                    {
                      swipeIndex: i,
                      play: true,
                      currentTime: 0,
                      buffering: true,
                    },
                    async () => {
                      await this.saveIndex();
                      this.triggerControls(false);
                      this.triggerSwipe('false', 'ignore');
                    },
                  );
                }}
                onTouchEnd={() => {
                  this.triggerControls(false);
                  play &&
                    setTimeout(() => {
                      this.triggerControls(true);
                    }, 3000);
                }}
                showsPagination={false}>
                {videos.map((itm, i) => (
                  <View
                    key={i}
                    style={{
                      height: '100%',
                      width: '100%',
                      alignItems: 'stretch',
                      backgroundColor: '#000',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                    {this.state.swipeIndex === i && (
                      <YoutubePlayer
                        ref={re => (this.playerRef = re)}
                        height="100%"
                        width="100%"
                        videoId={videos[this.state.swipeIndex].video}
                        play={play}
                        onChangeState={e => {
                          e === 'playing' && this.setState({buffering: false});
                        }}
                        loop
                        webViewStyle={{backgroundColor: '#000'}}
                        onReady={async e => {
                          let duration = itm.duration
                            ? itm.duration.toString()
                            : null;
                          let length = duration ? duration.length : 0;
                          let start =
                            length == 0 || length == 2
                              ? 0
                              : length == 3
                              ? parseInt(duration.substr(0, 1))
                              : parseInt(duration.substr(0, 2));
                          let ends =
                            length == 4
                              ? parseInt(duration.substr(2))
                              : length == 0
                              ? 0
                              : length == 3
                              ? parseInt(duration.substr(1))
                              : parseInt(duration.substr(0));
                          this.playerRef.seekTo(start);
                          let totalTime = await this.playerRef.getDuration();
                          totalTime = totalTime - ends;
                          if (swipeIndex === i) {
                            clearInterval(this.interval);
                            this.interval = setInterval(async () => {
                              const currentTime = await this.playerRef.getCurrentTime();

                              if (currentTime >= totalTime)
                                this.setState(
                                  {
                                    play: false,
                                    completed: videos.length - 1 == swipeIndex,
                                  },
                                  () => {
                                    this.triggerSwipe('true');
                                  },
                                );
                              this.setState({
                                currentTime,
                              });
                            }, 1000);
                            this.setState({totalTime}, () => {
                              this.triggerControls(true);
                            });
                          }
                        }}
                        volume={100}
                        initialPlayerParams={{
                          controls: false,
                          modestbranding: true,
                          preventFullScreen: true,
                          rel: false,
                        }}
                      />
                    )}

                    {buffering && (
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          zIndex: 15,
                          backgroundColor: '#000',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <LottieView
                          source={require('../res/imgs/buffer.json')}
                          loop
                          autoPlay
                          style={{width: 150, height: 90}}
                        />
                      </View>
                    )}

                    {/* <TouchableWithoutFeedback
                      onPress={() =>
                        this.setState(
                          {close: !this.state.close},
                          () => this.state.play && this.timeOutFunc(),
                        )
                      }> */}

                    <View
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        zIndex: 20,
                        justifyContent: 'space-between',
                      }}>
                      <LinearGr
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '20%',
                          transform: [{translateY: transY1}],
                        }}
                        colors={[
                          'rgba(0,0,0,0.8)',
                          'rgba(0,0,0,0.6)',
                          'rgba(0,0,0,0)',
                          'rgba(0,0,0,0)',
                        ]}
                        useAngle
                        angle={180}>
                        <View
                          style={{
                            flexDirection: 'row',
                            paddingHorizontal: 300,
                            paddingTop: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {videos.map((vid, i) =>
                            swipeIndex === i ? (
                              <Slider
                                key={i}
                                style={{width: 200}}
                                value={this.state.currentTime}
                                maximumValue={this.state.totalTime}
                                trackStyle={{
                                  height: 7,
                                  marginLeft: i === 0 ? 0 : 10,
                                  borderRadius: 10,
                                }}
                                thumbTouchSize={{height: 0, width: 0}}
                                thumbStyle={{height: 7, width: 7}}
                                minimumTrackTintColor="#fff"
                                maximumTrackTintColor="lightgrey"
                                thumbTintColor="rgba(0,0,0,0)"
                              />
                            ) : (
                              <View
                                key={i}
                                style={{
                                  width: 7,
                                  backgroundColor: 'lightgrey',
                                  height: 7,
                                  borderRadius: 10,
                                  marginLeft: i === 0 ? 0 : 5,
                                }}
                              />
                            ),
                          )}
                          <TouchableNativeFeedback
                            onPress={() => {
                              this.props.navigation.goBack();
                            }}>
                            <View
                              style={{
                                position: 'absolute',
                                right: 30,
                                top: 20,
                                width: 40,
                                height: 40,
                                justifyContent: 'center',
                              }}>
                              <Icon name="close" color="#fff" size={25} />
                            </View>
                          </TouchableNativeFeedback>
                        </View>
                      </LinearGr>
                      <LinearGr
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '20%',
                          alignSelf: 'flex-end',
                          bottom: 0,
                          transform: [{translateY: transY2}],
                        }}
                        colors={[
                          'rgba(0,0,0,0)',
                          'rgba(0,0,0,0)',
                          'rgba(0,0,0,0.6)',
                          'rgba(0,0,0,0.8)',
                        ]}
                        useAngle
                        angle={180}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingBottom: 10,
                            paddingHorizontal: 15,
                            justifyContent: 'space-between',
                          }}>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              this.setState({play: !this.state.play}, () => {
                                this.triggerControls(true);
                              });
                            }}
                            style={{overflow: 'hidden'}}>
                            <View
                              style={{
                                borderRadius: 30,
                                borderColor: '#fff',
                                borderWidth: 1.5,
                                width: 35,
                                height: 35,
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden',
                              }}>
                              {play ? (
                                <FontAwesome5
                                  name="pause"
                                  color="#fff"
                                  size={16}
                                />
                              ) : (
                                <FontAwesome5
                                  name="play"
                                  color="#fff"
                                  size={16}
                                />
                              )}
                            </View>
                          </TouchableWithoutFeedback>
                          <Slider
                            value={this.state.currentTime}
                            maximumValue={this.state.totalTime}
                            style={{width: '85%'}}
                            thumbTintColor={R.colors.primary}
                            minimumTrackTintColor={R.colors.primary}
                            trackStyle={{height: 2}}
                            thumbStyle={{width: 12, height: 12}}
                            onSlidingComplete={val =>
                              this.playerRef && this.playerRef.seekTo(val)
                            }
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              color: '#fff',
                              textAlignVertical: 'center',
                              marginBottom: 2,
                              fontFamily: 'monospace',
                            }}>
                            {
                              fmtMSS(
                                this.state.totalTime - this.state.currentTime,
                              ).split('.')[0]
                            }
                          </Text>
                        </View>
                      </LinearGr>
                    </View>
                  </View>
                ))}
              </Swiper>
              <Animated.View
                style={{
                  position: 'absolute',
                  right: 0,
                  transform: [{translateX}],
                  width: '20%',
                  height: '100%',
                  alignSelf: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  alignItems: 'center',
                  borderTopLeftRadius: height,
                  borderBottomLeftRadius: height,
                  flexDirection: 'row',
                }}>
                {!completed && (
                  <LottieView
                    source={require('../res/imgs/swipe.json')}
                    autoPlay
                    loop
                    colorFilters={[
                      {
                        keypath: 'scroll_up',
                        color: '#FFFFFF',
                      },
                    ]}
                    style={{
                      height: 100,
                      width: 100,
                      margin: 0,
                      padding: 0,
                      marginLeft: -20,
                      position: 'absolute',
                    }}
                  />
                )}
                <View
                  style={{
                    alignSelf: 'center',
                  }}>
                  {this.state.currentTime >= this.state.totalTime && (
                    <LottieView
                      source={
                        completed
                          ? require('../res/imgs/done.json')
                          : require('../res/imgs/count.json')
                      }
                      autoPlay
                      style={{
                        width: completed ? 90 : 40,
                        height: completed ? 90 : 40,
                        marginLeft: 20,
                      }}
                      loop={false}
                      onAnimationFinish={async () => {
                        completed
                          ? await this.final()
                          : this.triggerSwipe('false');
                      }}
                    />
                  )}
                </View>
              </Animated.View>
            </View>
          );
        }}
      </ContextStates.Consumer>
    );
  }
}

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 120,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

// position: absolute;
//           transform:scaleY(0.95);
//           top: -108%;
//           left: 0;
//           width: 100%;
//           height: 300%;
