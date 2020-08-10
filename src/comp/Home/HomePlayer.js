import React, {
  useState,
  createRef,
  useContext,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
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

const {width, height} = Dimensions.get('window');
// const vids = ['2dc7GuiQP0A', 'nP-i7AlROK4', '8iJ_gxjDuHM', 'JAX1cESZnFA'];
export const HomePlayer = forwardRef(({that, vidData}, ref) => {
  const context = useContext(ContextStates);
  const [playing, setPlay] = useState(false);
  const [thumb, setThumb] = useState('');
  const [buff, setBuff] = useState(true);
  const [index, setIndex] = useState(0);
  const videos = [];
  vidData.map(v => videos.push(v.video));
  useFocusEffect(() => {
    if (vidData != null) {
      getYoutubeMeta(vidData[0]?.video).then(meta => {
        setThumb(meta.thumbnail_url);
      });
    }
  }, []);

  let view = createRef(null);

  const onPlay = () => {
    view.current
      .bounceOut(400)
      .then(endState => endState.finished && setPlay(true));
  };
  const onPause = () => {
    setPlay(false);
    view.current.zoomIn(600);
  };
  useImperativeHandle(ref, () => ({
    playerPause() {
      onPause();
    },
  }));
  if (vidData == null) return <Loading load={that} />;
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
          }}
          webViewProps={{
            containerStyle: {backgroundColor: '#000'},
          }}
          width={'100%'}
          onReady={() => {
            view.current && playing == false ? onPlay() : setPlay(true);
          }}
          onChangeState={e => {
            if (e === 'ended') {
              if (videos.length - 1 == index) {
                setIndex(1);
                setIndex(0);
              } else setIndex(index + 1);

              setBuff(true);
            }
            e === 'playing' && setBuff(false);
          }}
        />
        {!playing && buff && (
          <ImageBackground
            style={{
              position: 'absolute',
              width,
              height: 250,
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
              height: 220,
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
                width: 150,
                height: 60,
              }}
            />
          </View>
        )}
        <TouchableWithoutFeedback onPress={() => onPause()}>
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
                  icon={{name: 'play-arrow', color: '#fff', size: 20}}
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
    height: 220,
    width,
    overflow: 'hidden',
    borderBottomEndRadius: 180,
    borderBottomStartRadius: 180,
    transform: [{scaleX: 2}],
    justifyContent: 'center',
  },
  youtube: {
    position: 'absolute',
    height: 220,
    width,
    alignSelf: 'center',
    transform: [{scaleX: 0.5}],
    justifyContent: 'center',
  },
  contentContainer: {
    height: 220,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  subHead: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  head: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  caption: {color: '#fff', fontSize: 12},
  btnContainer: {
    overflow: 'hidden',
    width: 120,
    marginTop: 10,
  },
  btnText: {fontSize: 14},
  btn: {
    backgroundColor: '#ff6701',
    padding: 6,
    paddingRight: 20,
    paddingLeft: 10,
    borderRadius: 20,
  },
});
