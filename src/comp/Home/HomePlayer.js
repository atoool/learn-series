import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import YouTube from 'react-native-youtube';
import {Button, Icon} from 'react-native-elements';
import {useIsFocused} from '@react-navigation/native';
import WebView from 'react-native-webview';
import YoutubeIframe from 'react-native-youtube-iframe';
import * as Animatable from 'react-native-animatable';

const {width, height} = Dimensions.get('window');

export const HomePlayer = props => {
  const [playing, setPlay] = useState(false);

  return (
    <View style={styles.constainer}>
      <YoutubeIframe
        videoId="7P0o-YhIwJs"
        play={playing}
        height={'160%'}
        initialPlayerParams={{
          controls: false,
          rel: false,
          preventFullScreen: true,
        }}
        webViewStyle={{
          marginLeft: '-33%',
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
          <Text style={styles.subHead}>The Wake Up</Text>
          <Text style={styles.head}>
            How can mindfullness help with isolation?
          </Text>
          <Text style={styles.caption}>more of your question answered</Text>
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
