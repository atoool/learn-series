import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import {StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import {EventEmitter} from 'events';

const PLAYER_STATES_NAMES = {
  UNSTARTED: 'unstarted',
  ENDED: 'ended',
  PLAYING: 'playing',
  PAUSED: 'paused',
  BUFFERING: 'buffering',
  VIDEO_CUED: 'video cued',
};

const PLAYER_STATES = {
  '-1': PLAYER_STATES_NAMES.UNSTARTED,
  0: PLAYER_STATES_NAMES.ENDED,
  1: PLAYER_STATES_NAMES.PLAYING,
  2: PLAYER_STATES_NAMES.PAUSED,
  3: PLAYER_STATES_NAMES.BUFFERING,
  5: PLAYER_STATES_NAMES.VIDEO_CUED,
};

const PLAYER_FUNCTIONS = {
  playVideo: 'player.playVideo(); true;',
  pauseVideo: 'player.pauseVideo(); true;',
  durationScript: `
  window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getDuration', data: player.getDuration()}));
  true;
  `,
  currentTimeScript: `
  window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getCurrentTime', data: player.getCurrentTime()}));
  true;
  `,
  seekToScript: (seconds, allowSeekAhead) => {
    return `player.seekTo(${seconds}, ${allowSeekAhead}); true;`;
  },
};

const YTPlayer = ({play, videoId, onChangeState, onReady}, ref) => {
  const eventEmitter = useRef(new EventEmitter());
  const webViewRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);

  const onWebMessage = useCallback(
    event => {
      try {
        const message = JSON.parse(event.nativeEvent.data);

        switch (message.eventType) {
          case 'playerStateChange':
            onChangeState(PLAYER_STATES[message.data]);
            break;
          case 'playerReady':
            onReady();
            setPlayerReady(true);
            break;
          default:
            eventEmitter.current.emit(message.eventType, message.data);
            break;
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [onReady, onChangeState],
  );

  useImperativeHandle(
    ref,
    () => ({
      getDuration: () => {
        webViewRef.current.injectJavaScript(PLAYER_FUNCTIONS.durationScript);
        return new Promise(resolve => {
          eventEmitter.current.once('getDuration', resolve);
        });
      },
      getCurrentTime: () => {
        webViewRef.current.injectJavaScript(PLAYER_FUNCTIONS.currentTimeScript);
        return new Promise(resolve => {
          eventEmitter.current.once('getCurrentTime', resolve);
        });
      },
      seekTo: (seconds, allowSeekAhead) => {
        webViewRef.current.injectJavaScript(
          PLAYER_FUNCTIONS.seekToScript(seconds, allowSeekAhead),
        );
      },
    }),
    [],
  );
  useEffect(() => {
    if (!playerReady) {
      return;
    }

    [play ? PLAYER_FUNCTIONS.playVideo : PLAYER_FUNCTIONS.pauseVideo].forEach(
      webViewRef.current.injectJavaScript,
    );
  }, [play, playerReady]);
  return (
    <WebView
      ref={webViewRef}
      bounces={false}
      originWhitelist={['*']}
      allowsInlineMediaPlayback
      style={[styles.webView]}
      mediaPlaybackRequiresUserAction={false}
      onMessage={onWebMessage}
      source={{
        html: `
<!DOCTYPE html>
<html>
    <head>
        <meta
        name="viewport"
        content="width=device-width"
      >
        <style>
          body {
            margin: 0;
          }
           .container {
            position: relative;
            width: 100%;
            height: 100%;
            padding-bottom: 56.25%;
            display: flex;
      justify-content: center;
          }
          .video {
            position: absolute;
            top: -81%;
            height: 250%;
          }
        </style>
      </head>
  <body>
  
        <div class="container">
            <div class="video" id="player" />
          </div>

    <script>
    
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {

            videoId: '${videoId}',
            playerVars: {
              rel: 0,
              playsinline: 1,
              loop: 0,
              controls: 0,
              fs: 1,
              modestbranding: 1,
            },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

    
      function onPlayerReady(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'playerReady'}))
      }

      var done = false;
      function onPlayerStateChange(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'playerStateChange', data: event.data}))
      }
    </script>
  </body>
</html>
`,
      }}
    />
  );
};

const styles = StyleSheet.create({
  webView: {width: '100%', height: '100%', backgroundColor: '#000'},
});

export default forwardRef(YTPlayer);
