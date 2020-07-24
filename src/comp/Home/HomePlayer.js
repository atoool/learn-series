import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {Button} from 'react-native-elements';
import YoutubeIframe, {getYoutubeMeta} from 'react-native-youtube-iframe';
import Loading from '../Loading';
import {useFocusEffect} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

export const HomePlayer = ({that, vidData}) => {
  const [playing, setPlay] = useState(false);
  const [thumb, setThumb] = useState('');
  useFocusEffect(() => {
    vidData != null &&
      getYoutubeMeta(vidData[0]?.video).then(meta => {
        setThumb(meta.thumbnail_url);
      });
  }, []);
  if (vidData == null) return <Loading load={that} />;
  return (
    <View style={styles.constainer}>
      <YoutubeIframe
        videoId={vidData[0].video}
        play={playing}
        height={'160%'}
        forceAndroidAutoplay={false}
        initialPlayerParams={{
          controls: false,
          rel: false,
          preventFullScreen: true,
        }}
        webViewProps={{
          renderLoading: () => {
            <ImageBackground
              style={styles.constainer}
              defaultSource={{
                cache: 'force-cache',
                uri: thumb,
              }}
            />;
          },
        }}
        webViewStyle={{
          marginLeft: '-36%',
          marginTop: '-10%',
          backgroundColor: '#000',
        }}
        width={'160%'}
        onChangeState={e => {
          e === 'paused' && setPlay(false);
          e === 'stopped' && setPlay(false);
          e === 'playing' && setPlay(true);
        }}
      />
      {!playing && (
        <View style={styles.contentContainer}>
          {/* <Text style={styles.subHead}></Text> */}
          <Text style={styles.head}>{vidData[0].title}</Text>
          <Text style={styles.subHead}>{vidData[0].desc.substr(0, 50)}...</Text>
          <Button
            title="WATCH"
            titleStyle={styles.btnText}
            icon={{name: 'play-arrow', color: '#fff', size: 20}}
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btn}
            onPress={() => setPlay(true)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  constainer: {
    height: 370,
    overflow: 'hidden',
    borderBottomEndRadius: 180,
    borderBottomStartRadius: 180,
  },
  youtube: {
    height: '100%',
    alignSelf: 'stretch',
  },
  contentContainer: {
    height: 370,
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
    marginTop: 20,
  },
  btnText: {fontSize: 14},
  btn: {
    backgroundColor: '#ff6701',
    padding: 10,
    paddingRight: 20,
    paddingLeft: 10,
    borderRadius: 20,
  },
});
