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
} from 'react-native';
import {Icon, Button, Slider} from 'react-native-elements';
import Orientation from 'react-native-orientation-locker';
import LinearGradient from 'react-native-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';
import GestureRecognizer from 'react-native-swipe-gestures';
import Swiper from 'react-native-swiper';
import {TouchableWithoutFeedback} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Animated, {Value, event, Easing} from 'react-native-reanimated';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  listenOrientationChange,
} from 'react-native-responsive-screen';
import {ContextStates} from '../func/ContextStates';
import YouTube from 'react-native-youtube';

const {width, height} = Dimensions.get('window');

const videos = [
  'EVFUZ8DwqFc',
  'IFQmOZqvtWg',
  'F6PhNnlb-14',
  'fLLScgWQcHc',
  '4Zne-5V30xg',
];

export default class Player extends React.PureComponent {
  static contextType = ContextStates;
  constructor(props) {
    super(props);

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
    };
  }
  componentDidMount() {
    Orientation.lockToLandscape();
    let {activateLoader} = this.context;
    activateLoader();
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

  onSwipeLeft = () => {};
  onSwipeRight = () => {};

  render() {
    const {play, buffering, swipeIndex} = this.state;
    const {fullScreen, currentTime, totalTime} = this.state;
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    const rTime = Math.abs(this.state.totalTime - this.state.currentTime) / 60;

    return (
      <ContextStates.Consumer>
        {({loader, playVideo}) => {
          if (loader || this.state.loader)
            return <View style={{flex: 1, backgroundColor: '#000'}} />;

          return (
            <View style={{height: '100%', width: '100%'}}>
              <StatusBar hidden translucent />
              <Swiper
                showsButtons={false}
                loop={false}
                onIndexChanged={i => {
                  clearInterval(this.interval);
                  this.setState({
                    swipeIndex: i,
                    play: false,
                    currentTime: 0,
                    buffering: true,
                  });
                }}
                showsPagination={false}>
                {videos.map((itm, i) => (
                  <View
                    key={itm}
                    style={{
                      height: '100%',
                      width: '100%',
                      alignItems: 'stretch',
                      backgroundColor: '#000',
                      justifyContent: 'center',
                    }}>
                    {swipeIndex === i && (
                      <YouTube
                        apiKey="AIzaSyCIsAH7Uc4vyb7Ihmc34XNTRDRAo0j3GhI"
                        ref={re => (this.playerRef = re)}
                        style={{height: '100%', width: '100%'}}
                        videoId={itm}
                        play={i === swipeIndex ? play : false}
                        onChangeState={e => {
                          e.state === 'playing'
                            ? this.setState({
                                play: i === swipeIndex ? true : false,
                              })
                            : e.state === 'buffering'
                            ? this.setState({play: true})
                            : this.setState({play: false});
                        }}
                        onReady={async () => {
                          // if (swipeIndex === i) {
                          clearInterval(this.interval);
                          this.interval = setInterval(async () => {
                            const totalTim = await this.playerRef.getDuration();
                            const currentTim = await this.playerRef.getCurrentTime();

                            // let c = this.state.currentTime;
                            // c[swipeIndex] = currentTim;
                            // let t = this.state.totalTime;
                            // t[swipeIndex] = totalTim;

                            this.setState({
                              currentTime: currentTim,
                              totalTime: totalTim,
                            });
                          }, 1000);
                          this.setState({buffering: false});
                          // }
                        }}
                        // volume={50}
                        // initialPlayerParams={{
                        //   controls: false,
                        //   modestbranding: true,
                        //   preventFullScreen: false,
                        //   rel: true,
                        // }}
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
                          backgroundColor: 'lightgrey',
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

                    {!this.state.play && (
                      <View
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          zIndex: 20,
                          justifyContent: 'space-between',
                        }}>
                        <LinearGradient
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            zIndex: 20,
                            justifyContent: 'space-between',
                          }}
                          colors={[
                            'rgba(0,0,0,0.8)',
                            'rgba(0,0,0,0.6)',
                            'rgba(0,0,0,0)',
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
                              paddingHorizontal: 300,
                              paddingTop: 20,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            {videos.map((vid, i) =>
                              swipeIndex === i ? (
                                <Slider
                                  key={vid}
                                  style={{width: 200}}
                                  value={this.state.currentTime}
                                  maximumValue={this.state.totalTime}
                                  trackStyle={{
                                    height: 7,
                                    marginLeft: i === 0 ? 0 : 10,
                                    borderRadius: 10,
                                  }}
                                  thumbStyle={{height: 0, width: 0}}
                                  minimumTrackTintColor="#fff"
                                  maximumTrackTintColor="lightgrey"
                                  thumbTintColor="#fff"
                                />
                              ) : (
                                <View
                                  key={vid}
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
                                playVideo();
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
                                this.setState(
                                  {play: !play},
                                  () => this.state.play && this.timeOutFunc(),
                                );
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
                              onValueChange={val => {
                                this.setState({currentTime: val});
                              }}
                              onSlidingComplete={val =>
                                this.playerRef.seekTo(this.state.currentTime)
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
                        </LinearGradient>
                      </View>
                    )}
                  </View>
                ))}
              </Swiper>
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
