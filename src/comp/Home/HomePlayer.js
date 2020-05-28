import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import YouTube from 'react-native-youtube';
import {Button} from 'react-native-elements';

export const HomePlayer = props => {
  const [playing, setPlay] = useState(true);
  return (
    <View style={styles.constainer}>
      <YouTube
        apiKey="AIzaSyCIsAH7Uc4vyb7Ihmc34XNTRDRAo0j3GhI"
        videoId="7P0o-YhIwJs"
        play={playing}
        controls={playing ? 2 : 0}
        style={styles.youtube}
        onReady={() => setPlay(false)}
        onChangeState={e => e.state === 'paused' && setPlay(false)}
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
    height: 450,
    overflow: 'hidden',
    borderBottomEndRadius: 180,
    borderBottomStartRadius: 180,
  },
  youtube: {
    height: '100%',
    alignSelf: 'stretch',
  },
  contentContainer: {
    alignSelf: 'center',
    width: '60%',
    marginTop: -180,
    alignItems: 'center',
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
