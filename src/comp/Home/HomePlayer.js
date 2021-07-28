import React, {
  useState,
  createRef,
  useContext,
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
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
import {useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Gradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {ContextStates} from '../../func/ContextStates';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import R from '../../res/R';
import YTPlayer from '../YTPlayer';

const {width, height} = Dimensions.get('window');

export const HomePlayer = forwardRef(({that, vidData}, ref) => {
  let view = createRef(null);
  const context = useContext(ContextStates);
  const [playing, setPlay] = useState(false);
  const [buff, setBuff] = useState(true);
  const [index, setIndex] = useState(0);
  let appState = useRef(AppState.currentState);

  useFocusEffect(
    useCallback(() => {
      AppState.addEventListener('change', c => (appState.current = c));
      return () => {
        view.current && onPause();
        AppState.removeEventListener('change', c => (appState.current = c));
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const onPlay = () => {
    view.current
      .bounceOut(400)
      .then(endState => endState.finished && setPlay(true));
  };
  const onPause = () => {
    setPlay(false);
    view.current.zoomIn(600);
  };
  appState.current === 'background' && view.current && onPause();
  useImperativeHandle(ref, () => ({
    playerPause() {
      onPause();
    },
  }));
  if (vidData == null) {
    return <View />;
  }
  const videos = vidData?.map(i => i?.video);

  return (
    <View key={context.connected} style={styles.container}>
      <View style={styles.youtube}>
        <YTPlayer
          key={index}
          videoId={videos[index]}
          play={playing}
          portrait={true}
          onChangeState={e => {
            if (e === 'ended') {
              if (videos.length - 1 === index) {
                setIndex(1);
                setIndex(0);
              } else {
                setIndex(index + 1);
              }

              setBuff(true);
            }
            e === 'playing' && setBuff(false);
          }}
          onReady={() => {
            console.warn('s');
          }}
        />
        {!playing && buff && vidData && (
          <ImageBackground
            style={styles.thumb}
            source={{
              cache: 'force-cache',
              uri: vidData[index].thumbnailUrl,
            }}
          />
        )}
        {playing && buff && (
          <View style={styles.lottieBox}>
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
              <Animatable.View style={styles.animBox} ref={view}>
                <Text style={styles.head}>{vidData[0].title}</Text>
                <Text style={styles.subHead}>
                  {vidData[0].description.substr(0, 50)}...
                </Text>
                <Button
                  title={R.locale.watch}
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
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: hp(26.8),
    width: '100%',
    overflow: 'hidden',
    borderBottomStartRadius: height < 600 ? hp(15) : hp(23),
    borderBottomEndRadius: height < 600 ? hp(15) : hp(23),
    transform: height < 600 ? [{scaleX: 1}] : [{scaleX: 2}],
  },
  youtube: {
    position: 'absolute',
    height: hp(26.8),
    width: '100%',
    transform: height < 600 ? [{scaleX: 1}] : [{scaleX: 0.5}],
  },
  contentContainer: {
    height: hp(26.8),
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
  thumb: {
    position: 'absolute',
    width,
    height: hp(26.9),
    backgroundColor: '#fff',
  },
  lottieBox: {
    backgroundColor: '#000',
    height: hp(28.2),
    width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  animBox: {alignItems: 'center'},
});
