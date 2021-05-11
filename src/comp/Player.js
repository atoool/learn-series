import React from 'react';
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Text,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  AppState,
  SafeAreaView,
} from 'react-native';
import Slider from 'react-native-smooth-slider';
import {Icon} from 'react-native-elements';
import Orientation from 'react-native-orientation-locker';
import LinearGradient from 'react-native-linear-gradient';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {TouchableWithoutFeedback} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ContextStates} from '../func/ContextStates';
import LottieView from 'lottie-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
// import FindLocalDevices from 'react-native-find-local-devices';
import R from '../res/R';
// import dgram from 'react-native-udp';

const {height, width} = Dimensions.get('window');

function fmtMSS(s) {
  return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s;
}
const LinearGr = Animated.createAnimatedComponent(LinearGradient);

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
      totalTime: 60,
      crntVideo: '',
      swipeIndex: 0,
      buffering: true,
      loader: false,
      chapter: 1,
      lesson: 1,
      enableSwipe: false,
      title: '',
      completed: false,
      lessons: 1,
      ip: '',
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
    });
    setTimeout(() => {
      this.props.route.params.lesson !== lesson &&
        this.refSwipe.scrollToIndex({
          index: this.props.route.params.chapter,
          animated: true,
        });
    }, 1000);
    AppState.addEventListener('change', state => {
      state === 'background' && this.setState({play: false});
    });
    this.blur = this.props.navigation.addListener('blur', () => {
      clearInterval(this.interval);
      Orientation.lockToPortrait();
      AppState.removeEventListener('change', state => {
        state === 'background' && this.setState({play: false});
      });
    });

    // DeviceEventEmitter.addListener('new_device_found', (device) => {
    //   this.setState({ip: device.ipAddress});
    //   try {
    //     this.socket = dgram.createSocket('udp4');
    //     this.socket.bind(12345);
    //     this.socket.once('listening', function () {});
    //   } catch (e) {
    //     console.warn(e);
    //   }
    //   console.warn('ss');
    // });

    // DeviceEventEmitter.addListener('connection_error', () => {
    //   this.setState({ip: ''});
    //   console.warn('dd');
    // });

    // DeviceEventEmitter.addListener('no_devices', () => {
    //   this.setState({ip: ''});
    //   console.warn('hh');
    // });

    // DeviceEventEmitter.addListener('no_ports', () => {
    //   this.setState({ip: ''});
    //   console.warn('ee');
    // });
    // this.getLocalDevices();
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
    this.blur = this.props.navigation.removeListener('blur', () => {
      clearInterval(this.interval);
      Orientation.lockToPortrait();
      AppState.removeEventListener('change', state => {
        state === 'background' && this.setState({play: false});
      });
    });
    // DeviceEventEmitter.removeListener('new_device_found', (device) => {
    //   this.setState({ip: device.ipAddress});
    //   try {
    //     this.socket = dgram.createSocket('udp4');
    //     this.socket.bind(12345);
    //     this.socket.once('listening', function () {});
    //   } catch {}
    // });

    // DeviceEventEmitter.removeListener('connection_error', () => {
    //   this.setState({ip: ''});
    // });

    // DeviceEventEmitter.removeListener('no_devices', () => {
    //   this.setState({ip: ''});
    // });

    // DeviceEventEmitter.removeListener('no_ports', () => {
    //   this.setState({ip: ''});
    // });
  };

  getLocalDevices = () => {
    // FindLocalDevices.getLocalDevices({
    //   timeout: 10,
    //   ports: [3000],
    // });
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

  triggerSwipe = async (show, ignore) => {
    clearTimeout(this.hideSwipe);
    Animated.timing(this.animSwipe, {
      toValue: show === 'false' ? 0 : 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.cubic,
    }).start();
    !ignore &&
      show === 'false' &&
      this.props.route.params.videos.length - 1 !== this.state.swipeIndex &&
      this.refSwipe.scrollToIndex({
        index: this.state.swipeIndex + 1,
        animated: true,
      });
    show === 'true' && (await this.saveIndex());
  };

  saveIndex = async () => {
    let {swipeIndex, chapter, lesson} = this.state;
    const {type, videos, lessons} = this.props.route.params;
    const playLesson = this.props.route.params.lesson;
    if (lesson <= playLesson) {
      if (
        chapter - 1 <= swipeIndex &&
        type !== 'random' &&
        lessons !== lesson
      ) {
        chapter = swipeIndex + 1;
        lesson = this.state.lesson;
        if (swipeIndex === videos.length - 1 && lessons !== lesson) {
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
    }
  };

  render() {
    const {play, swipeIndex} = this.state;
    const {videos} = this.props.route.params;

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
      <SafeAreaView
        style={{height: '100%', width: '100%', backgroundColor: '#000'}}>
        <SwiperFlatList
          index={0}
          ref={r => (this.refSwipe = r)}
          onMomentumScrollEnd={({index}) => {
            this.setState(
              {
                swipeIndex: index,
                play: true,
                currentTime: 0,
                buffering: true,
              },
              () => {
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
          }}>
          {videos.map((itm, i) => (
            <View key={i} style={{width: height}}>
              {this.state.swipeIndex === i && (
                <YoutubePlayer
                  key={this.state.swipeIndex}
                  ref={re => (this.playerRef = re)}
                  width="100%"
                  height="100%"
                  videoId={itm.video}
                  play={this.state.play}
                  contentScale={0.65}
                  webViewStyle={{marginTop: -10}}
                  onChangeState={e => {
                    e === 'playing' && this.setState({buffering: false});
                  }}
                  onReady={async e => {
                    if (this.state.swipeIndex === i) {
                      clearInterval(this.interval);
                      let start = itm?.start_time;
                      let ends = itm?.end_time;
                      let totalTime = 60;
                      this.playerRef.seekTo(start);

                      this.interval = setInterval(async () => {
                        let totalTim =
                          ends === 0
                            ? await this.playerRef.getDuration().catch(() => {})
                            : ends;

                        totalTime = totalTim === 0 ? 60 : totalTim;
                        const currentTime =
                          await this.playerRef.getCurrentTime();

                        if (currentTime >= totalTime) {
                          this.setState(
                            {
                              play: false,
                              completed: videos.length - 1 === swipeIndex,
                            },
                            async () => {
                              this.triggerSwipe('true');
                            },
                          );
                        }
                        this.setState({
                          currentTime,
                          totalTime,
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

              {this.state.buffering && (
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
                    'rgba(0,0,0,0.9)',
                    'rgba(0,0,0,0.7)',
                    'rgba(0,0,0,0.5)',
                    'rgba(0,0,0,0.3)',
                    'rgba(0,0,0,0.1)',
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
                    {/* {this.state.ip != '' && (
                      <TouchableNativeFeedback
                        onPress={() => {
                          const vidJson = JSON.stringify(videos);
                          console.warn(this.state.ip, vidJson);

                          try {
                            this.socket.send(
                              vidJson,
                              undefined,
                              undefined,
                              12346,
                              this.state.ip,
                              function (err) {
                                if (err) throw err;
                              },
                            );
                            this.setState({play: false});
                          } catch (e) {
                            console.warn(e);
                          }
                        }}>
                        <View
                          style={{
                            position: 'absolute',
                            left: 30,
                            top: 20,
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                          }}>
                          <Icon name="cast" color="#ffffff" size={25} />
                        </View>
                      </TouchableNativeFeedback>
                    )} */}
                    {videos.map((vid, ind) =>
                      swipeIndex === ind ? (
                        <Slider
                          key={ind}
                          style={{width: 200}}
                          value={this.state.currentTime / this.state.totalTime}
                          maximumValue={1}
                          trackStyle={{
                            height: 7,
                            marginLeft: ind === 0 ? 0 : 10,
                            borderRadius: 10,
                          }}
                          thumbTouchSize={{height: 1, width: 1}}
                          thumbStyle={{height: 7, width: 7}}
                          minimumTrackTintColor="#fff"
                          maximumTrackTintColor="lightgrey"
                          thumbTintColor="rgba(0,0,0,0)"
                        />
                      ) : (
                        <View
                          key={ind}
                          style={{
                            width: 7,
                            backgroundColor: 'lightgrey',
                            height: 7,
                            borderRadius: 10,
                            marginLeft: ind === 0 ? 0 : 5,
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
                        <Icon name="close" color="#ffffff" size={25} />
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
                    'rgba(0,0,0,0.7)',
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
                          // this.getLocalDevices();
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
                          <FontAwesome5 name="pause" color="#fff" size={16} />
                        ) : (
                          <FontAwesome5 name="play" color="#fff" size={16} />
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                    <Slider
                      value={this.state.currentTime / this.state.totalTime}
                      maximumValue={1}
                      style={{width: '85%'}}
                      thumbTintColor={R.colors.primary}
                      minimumTrackTintColor={R.colors.primary}
                      trackStyle={{height: 4}}
                      maximumTrackTintColor={'#fff'}
                      thumbStyle={{width: 14, height: 14}}
                      onValueChange={() => this.triggerControls(true)}
                      onSlidingComplete={val => {
                        const to = val * this.state.totalTime;
                        this.playerRef && this.playerRef.seekTo(to);
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: 'bold',
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
        </SwiperFlatList>
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
          {!this.state.completed && (
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
                  this.state.completed
                    ? require('../res/imgs/done.json')
                    : require('../res/imgs/count.json')
                }
                autoPlay
                style={{
                  width: this.state.completed ? 90 : 40,
                  height: this.state.completed ? 90 : 40,
                  marginLeft: 20,
                }}
                loop={false}
                onAnimationFinish={() => {
                  this.state.completed
                    ? this.props.navigation.goBack()
                    : this.triggerSwipe('false');
                }}
              />
            )}
          </View>
        </Animated.View>
      </SafeAreaView>
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
  container: {flex: 1, backgroundColor: 'white'},
  child: {width, justifyContent: 'center'},
  text: {fontSize: width * 0.5, textAlign: 'center'},
});

// position: absolute;
//           transform:scaleY(0.95);
//           top: -108%;
//           left: 0;
//           width: 100%;
//           height: 300%;
