import React, {PureComponent} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StatusBar,
  Image,
  Linking,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Overlay, Tile, Button} from 'react-native-elements';
import R from '../res/R';
import Loading from '../comp/Loading';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const {width} = Dimensions.get('screen');

export default class RateUs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {data: {}, isVisible: false, img: ''};
  }
  componentDidMount = async () => {
    let lang = await AsyncStorage.getItem('lang').catch((e) => {});
    lang == null && 'en';
    await fetch(
      `http://riafy.me/splash.php?appname=${R.strings.bundleId}&country=IN&simcountry=in&version=1.3.2&versioncode=24&lang=${lang}&inputlang=${lang}&network=wifi&loadcount=3&devtype=p&fbclid=IwAR0M6OClxu5DMoJl3efjkEwRSLlJx26JVP9yX8Ywfw70iHDPEWODl1YHUJs`,
    )
      .then((res) => res.json())
      .then((respons) => {
        respons.splash &&
          this.setState({
            data: respons.splash,
            img: respons.splash.image,
            isVisible:
              this.props.isVisible == true ? this.props.isVisible : false,
          });
      });
  };
  onRate = async () => {
    await AsyncStorage.setItem('rateus', 'rated').catch((e) => {});
    this.setState({isVisible: false}, () => {
      Linking.openURL(this.state.data.url).catch((e) => {});
    });
  };
  render() {
    return (
      <Overlay
        isVisible={this.state.img == '' ? false : this.state.isVisible}
        overlayStyle={{
          padding: 0,
          width: width - wp(22),
          height: width - hp(15.4),
          marginHorizontal: hp(6),
          justifyContent: 'center',
        }}
        animationType="fade"
        onBackdropPress={() => this.setState({isVisible: false})}>
        <View>
          <StatusBar backgroundColor="#000" />
          {this.state.data?.image == null ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator color={R.colors.primary} />
            </View>
          ) : (
            <View style={{backgroundColor: R.colors.background}}>
              <Image
                source={{uri: this.state.data.image}}
                style={{
                  width: width - wp(22),
                  height: width - hp(15.4),
                  backgroundColor: 'lightgrey',
                }}
              />
              <View style={{padding: hp(1.9)}}>
                <Text style={{fontSize: hp(2.1), color: 'grey'}}>
                  {this.state.data.message}
                </Text>
                <Button
                  title={this.state.data.button}
                  buttonStyle={{
                    marginTop: hp(1.9),
                    backgroundColor: R.colors.primary,
                    paddingHorizontal: hp(1.3),
                    marginHorizontal: wp(10.4),
                  }}
                  containerStyle={{width: 'auto'}}
                  onPress={this.onRate}
                />
              </View>
            </View>
          )}
        </View>
      </Overlay>
    );
  }
}
