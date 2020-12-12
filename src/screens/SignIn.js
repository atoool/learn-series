import React from 'react';
import {View, Text, StyleSheet, ToastAndroid} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

import R from '../res/R';
import {Button} from 'react-native-elements';
import {ContextStates} from '../func/ContextStates';
import {onSignedIn} from '../func/Reducer';

export default class SignIn extends React.PureComponent {
  static contextType = ContextStates;
  state = {userInfo: null};
  componentDidMount = async () => {
    GoogleSignin.configure({
      webClientId:
        '936442884198-uvh4bif5p8jkn3fmgrneb1olr9vuq7h9.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    });
  };

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      ToastAndroid.show(
        'Signed in as ' + userInfo.user.name,
        ToastAndroid.BOTTOM,
      );
      this.props.navigation.goBack();
      await this.context.dispatch({type: 'signIn', payload: true});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.warn('cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.warn('in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.warn('play service not awailable');
      } else {
        // some other error happened
        console.warn(error);
      }
    }
  };

  signOut = async () => {
    try {
      const {isSignedIn} = this.context.reduState;
      if (isSignedIn) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut().then(async () => {
          ToastAndroid.show('Logged out', ToastAndroid.BOTTOM);
          await this.context.dispatch({type: 'signIn', payload: false});
          this.props.navigation.goBack();
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const {isSignedIn} = this.context.reduState;
    return (
      <View style={styles.container}>
        <View style={{}}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              fontFamily: R.fonts.primary,
              marginBottom: 10,
            }}>
            Sign Up
          </Text>
          <Text
            style={{
              color: 'grey',
              fontSize: 15,
              fontFamily: R.fonts.text,
            }}>
            BY signing up, you can get personalised recipe recommendations,
            create recipe recommendations, create meal plans, print recipes and
            more.
          </Text>
        </View>
        <View style={{position: 'absolute', bottom: 80, right: 30, left: 30}}>
          <Button
            title={isSignedIn ? 'Logout' : 'Sign up with Google'}
            buttonStyle={{backgroundColor: '#F44336', height: 55}}
            onPress={isSignedIn ? this.signOut : this.signIn}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
});
