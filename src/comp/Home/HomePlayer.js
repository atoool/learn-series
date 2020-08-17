import React, {
  useState,
  createRef,
  useContext,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  AppState,
} from 'react-native';
import {Button} from 'react-native-elements';
import YoutubeIframe, {getYoutubeMeta} from 'react-native-youtube-iframe';
import Loading from '../Loading';
import {useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Gradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {ContextStates} from '../../func/ContextStates';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');
// const vids = ['2dc7GuiQP0A', 'nP-i7AlROK4', '8iJ_gxjDuHM', 'JAX1cESZnFA'];
export const HomePlayer = forwardRef(({that, vidData}, ref) => {
  let view = createRef(null);
  let timeout = createRef(null);
  const context = useContext(ContextStates);
  const [playing, setPlay] = useState(false);
  const [thumb, setThumb] = useState('');
  const [buff, setBuff] = useState(true);
  const [index, setIndex] = useState(0);
  const videos = [];
  let appState = useRef(AppState.currentState);
  vidData.map(v => videos.push(v.video));
  useFocusEffect(() => {
    AppState.addEventListener('change', c => (appState.current = c));
    if (vidData != null) {
      getYoutubeMeta(vidData[0]?.video).then(meta => {
        setThumb(meta.thumbnail_url);
      });
    }
    return () => {
      view.current && onPause();
      AppState.removeEventListener('change', c => (appState.current = c));
    };
  }, []);

  const onPlay = () => {
    view.current
      .bounceOut(400)
      .then(endState => endState.finished && setPlay(true));
  };
  const onPause = () => {
    setPlay(false);
    view.current.zoomIn(600);
  };
  appState.current == 'background' && view.current && onPause();
  useImperativeHandle(ref, () => ({
    playerPause() {
      onPause();
    },
  }));
  if (vidData == null) return <View />;
  return (
    <View key={context.connected} style={styles.constainer}>
      {/* {vids.map((vid, i) => ( */}
      <View style={styles.youtube}>
        <YoutubeIframe
          key={index}
          playList={videos}
          play={playing}
          height={'100%'}
          playListStartIndex={index}
          forceAndroidAutoplay={true}
          initialPlayerParams={{
            rel: false,
            preventFullScreen: true,
            showClosedCaptions: false,
            loop: true,
          }}
          webViewProps={{
            containerStyle: {backgroundColor: '#000'},
          }}
          width={'auto'}
          onReady={() => {
            // view.current && playing == false ? onPlay() : onPause();
          }}
          onChangeState={e => {
            if (e === 'ended') {
              if (videos.length - 1 == index) {
                setIndex(1);
                setIndex(0);
              } else setIndex(index + 1);

              setBuff(true);
            }
            // else if (e === 'buffering') {
            //   clearTimeout(timeout);
            //   timeout.current = setTimeout(() => {
            //     if (buff) {
            //       onPause();
            //     }
            //   }, 5000);
            // }
            e === 'playing' && setBuff(false);
          }}
        />
        {!playing && buff && (
          <ImageBackground
            style={{
              position: 'absolute',
              width,
              height: hp(26.9),
              backgroundColor: '#fff',
            }}
            source={{
              cache: 'force-cache',
              uri: thumb,
            }}
          />
        )}
        {playing && buff && (
          <View
            style={{
              backgroundColor: '#000',
              height: hp(28.2),
              width,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
            }}>
            <LottieView
              source={require('../../res/imgs/buffer.json')}
              loop
              autoPlay
              style={{
                width: wp(41.7),
                height: hp(7.7),
              }}
            />
          </View>
        )}
        <TouchableWithoutFeedback
          onPress={() => (playing ? onPause() : onPlay())}>
          <View style={styles.contentContainer}>
            <Gradient
              colors={[
                'rgba(0,0,0,0)',
                !playing ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0)',
              ]}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.contentContainer}>
              {/* <Text style={styles.subHead}></Text> */}

              <Animatable.View style={{alignItems: 'center'}} ref={view}>
                <Text style={styles.head}>{vidData[0].title}</Text>
                <Text style={styles.subHead}>
                  {vidData[0].desc.substr(0, 50)}...
                </Text>
                <Button
                  title="WATCH"
                  titleStyle={styles.btnText}
                  icon={{name: 'play-arrow', color: '#fff', size: hp(2.6)}}
                  containerStyle={styles.btnContainer}
                  buttonStyle={styles.btn}
                  onPress={onPlay}
                />
              </Animatable.View>
            </Gradient>
          </View>
        </TouchableWithoutFeedback>
      </View>
      {/* ))} */}
    </View>
  );
});

const styles = StyleSheet.create({
  constainer: {
    height: hp(28.2),
    width: '100%',
    overflow: 'hidden',
    borderBottomStartRadius: height < 600 ? hp(15) : hp(23),
    borderBottomEndRadius: height < 600 ? hp(15) : hp(23),
    transform: height < 600 ? [{scaleX: 1}] : [{scaleX: wp(0.556)}],
    justifyContent: 'center',
    alignSelf: 'center',
  },
  youtube: {
    position: 'absolute',
    height: hp(28.2),
    width: '100%',
    transform: height < 600 ? [{scaleX: 1}] : [{scaleX: wp(0.1389)}],
  },
  contentContainer: {
    height: hp(28.2),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: hp(2.6),
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  subHead: {
    color: '#fff',
    fontSize: wp(3.33),
    fontWeight: 'bold',
    marginBottom: hp(0.6),
  },
  head: {
    color: '#fff',
    fontSize: hp(2.6),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(0.6),
  },
  caption: {color: '#fff', fontSize: hp(1.5)},
  btnContainer: {
    overflow: 'hidden',
    width: wp(33.33),
    marginTop: hp(1.3),
  },
  btnText: {fontSize: hp(1.7)},
  btn: {
    backgroundColor: '#ff6701',
    padding: hp(0.8),
    paddingRight: wp(5.6),
    paddingLeft: wp(2.8),
    borderRadius: hp(2.6),
  },
});
