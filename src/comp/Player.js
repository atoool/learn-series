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
import YoutubePlayer from 'react-native-youtube-iframe';
import WebView from 'react-native-webview';

const {width, height} = Dimensions.get('window');

const videos = [
  'EVFUZ8DwqFc',
  'IFQmOZqvtWg',
  'F6PhNnlb-14',
  'fLLScgWQcHc',
  '4Zne-5V30xg',
];
const LinearGr = Animated.createAnimatedComponent(LinearGradient);

const Swipr = Animated.createAnimatedComponent(Swiper);
export default class Player extends React.PureComponent {
  static contextType = ContextStates;
  constructor(props) {
    super(props);
    this.animated = new Animated.Value(0);
    this.animSwipe = new Animated.Value(0);
    this.state = {
      play: false,
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
    };
  }
  componentDidMount() {
    StatusBar.setHidden(true);
    StatusBar.setTranslucent(true);
    Orientation.lockToLandscape();
    const session = this.context.reduState.session[
      this.context.reduState.session.length - 1
    ];
    const chapter = session.chapter;
    const lesson = session.lesson;
    this.setState({chapter, lesson});
    setTimeout(() => {
      this.setState({loader: false});
    }, 1000);
    this.back = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
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
    this.back.remove();
  };

  triggerControls = show => {
    clearTimeout(this.hideControl);
    Animated.timing(this.animated, {
      toValue: !this.state.play ? 0 : 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
    this.setState({play: !this.state.play}, () => {
      this.state.play && this.timeOutFunc();
    });
    // this.hideControl = setTimeout(() => {
    //   Animated.timing(this.animated, {
    //     toValue: 0,
    //     duration: 300,
    //     useNativeDriver: true,
    //   }).start();
    // }, 1500);
  };

  triggerSwipe = show => {
    clearTimeout(this.hideSwipe);
    Animated.timing(this.animSwipe, {
      toValue: show == 'false' ? 0 : 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.cubic,
    }).start();
    clearInterval(this.interval);
    show == 'false' &&
      this.context.reduState.videos.length - 1 !== this.state.swipeIndex &&
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

  saveIndex = () => {
    if (
      this.state.chapter < this.state.swipeIndex + 1 &&
      this.props.type != 'random'
    ) {
      const chapter = this.state.swipeIndex + 1;
      let lesson = this.state.lesson;
      this.state.swipeIndex + 1 == this.context.reduState.videos.length &&
        (lesson = this.state.lesson + 1);
      this.setState({chapter, lesson});
      let session =
        this.props.type === 'sleep'
          ? this.context.reduState.sleepPr
          : this.context.reduState.session;
      session[
        this.props.type === 'sleep' ? session.length - 1 : 0
      ].chapter = chapter;
      session[
        this.props.type === 'sleep' ? session.length - 1 : 0
      ].lesson = lesson;
      this.context.dispatch({
        type: this.props.type === 'sleep' ? 'sleepSess' : 'session',
        payload: [...session],
      });
    }
  };

  render() {
    const {play, buffering, swipeIndex, enableSwipe} = this.state;
    const {fullScreen, currentTime, totalTime} = this.state;
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    const rTime = Math.abs(this.state.totalTime - this.state.currentTime) / 60;

    const transY1 = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -60],
    });
    const transY2 = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 80],
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
                // scrollEnabled={enableSwipe}
                showsButtons={false}
                index={this.state.swipeIndex}
                loop={false}
                onIndexChanged={i => {
                  clearInterval(this.interval);
                  this.setState(
                    {
                      swipeIndex: i,
                      play: false,
                      currentTime: 0,
                      buffering: true,
                      // enableSwipe: false,
                    },
                    this.saveIndex,
                  );
                }}
                showsPagination={false}>
                {this.context.reduState.videos.map((itm, i) => (
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
                        apiKey="AIzaSyCIsAH7Uc4vyb7Ihmc34XNTRDRAo0j3GhI"
                        autoplay={false}
                        height="100%"
                        width="100%"
                        videoId={itm}
                        webViewProps={{
                          textZoom: 0,
                          // containerStyle: {left: '-20%'},
                          javaScriptEnabled: true,
                        }}
                        play={i === swipeIndex ? this.state.play : false}
                        onChangeState={e => {
                          (e.state === 'paused' || e.state === 'stopped') &&
                            this.setState({play: false});
                          e.state === 'playing' &&
                            this.setState({enableSwipe: true});
                          if (e.state === 'stopped') this.playerRef = null;
                        }}
                        loop
                        onError={e => {
                          console.warn(e);
                        }}
                        onReady={async e => {
                          if (swipeIndex === i) {
                            clearInterval(this.interval);
                            this.interval = setInterval(async () => {
                              const totalTime = await this.playerRef.getDuration();
                              const currentTime = await this.playerRef.getCurrentTime();

                              if (currentTime >= totalTime - 5)
                                this.setState({play: false}, () => {
                                  this.context.reduState.videos.length - 1 ==
                                  swipeIndex
                                    ? playVideo('', 1)
                                    : this.triggerSwipe('true');
                                });
                              this.setState({
                                currentTime,
                                totalTime: totalTime - 1,
                              });
                            }, 1000);
                            this.setState({buffering: false}, () => {
                              this.triggerControls(true);
                            });
                          }
                        }}
                        // volume={50}
                        initialPlayerParams={{
                          controls: false,
                          modestbranding: true,
                          preventFullScreen: true,
                          rel: false,
                          showClosedCaptions: false,
                          end: 60,
                        }}
                        controls={this.state.play ? 2 : 0}
                        modestbranding={true}
                        rel={false}
                      />
                    )}

                    {buffering && (
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          zIndex: 15,
                          backgroundColor: buffering
                            ? 'lightgrey'
                            : 'rgba(0,0,0,0)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#fff',
                            fontFamily: 'monospace',
                          }}>
                          Buffering...
                        </Text>
                      </View>
                    )}

                    {/* <TouchableWithoutFeedback
                      onPress={() =>
                        this.setState(
                          {close: !this.state.close},
                          () => this.state.play && this.timeOutFunc(),
                        )
                      }> */}

                    {this.state.play && (
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
                            {this.context.reduState.videos.map((vid, i) =>
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
                                  thumbStyle={{height: 1, width: 1}}
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
                                // this.props.navigation.goBack();
                                playVideo('', 1);
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
                                // this.setState({play: !this.state.play}, () => {
                                this.triggerControls(true);

                                // });
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
                              thumbTintColor="#fa744f"
                              minimumTrackTintColor="#fa744f"
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
                                (
                                  (this.state.totalTime -
                                    this.state.currentTime) /
                                  60
                                )
                                  .toString()
                                  .split('.')[0]
                              }
                              :
                              {
                                (
                                  (this.state.totalTime -
                                    this.state.currentTime) /
                                  60
                                )
                                  .toFixed(2)
                                  .toString()
                                  .split('.')[1]
                              }
                            </Text>
                          </View>
                        </LinearGr>
                      </View>
                    )}
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
                <View
                  style={{
                    alignSelf: 'center',
                  }}>
                  {this.state.currentTime >= this.state.totalTime - 5 && (
                    <LottieView
                      source={require('../res/imgs/count.json')}
                      autoPlay
                      style={{
                        width: 40,
                        height: 40,
                        marginLeft: 20,
                      }}
                      loop={false}
                      onAnimationFinish={() => this.triggerSwipe('false')}
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
