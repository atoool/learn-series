import React, {useContext} from 'react';
import {StyleSheet, KeyboardAvoidingView} from 'react-native';
import WebView from 'react-native-webview';
import Loader from './Loader';
import {ContextStates} from '../func/ContextStates';
import R from '../res/R';

export const CommonWeb = ({page, params = '', onResponse = () => {}}) => {
  const {
    locale: {code = 'en'},
  } = R;
  const {
    connected,
    reduState: {premiumPurchased},
  } = useContext(ContextStates);

  const isPremium = premiumPurchased;

  const uri = `file:///android_asset/${page}.html?lang=${code}&appname=${'com.rstream.piano'}&simcountry=in&loadcount=1${
    isPremium ? '&datanew=true' : ''
  }${params}&country=GB&version=${'1.3.2'}&versioncode=${2}&inputlang=${code}&_id=1&android&n2021`;

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <WebView
        style={styles.container}
        key={connected}
        renderError={() => <Loader load={this} />}
        source={{
          uri,
        }}
        cacheEnabled
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        mediaPlaybackRequiresUserAction={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        pagingEnabled={true}
        allowsBackForwardNavigationGestures={true}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        onShouldStartLoadWithRequest={onResponse}
        renderLoading={() => <Loader load={this} />}
        startInLoadingState
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});
