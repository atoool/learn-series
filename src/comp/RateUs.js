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
import axios from 'axios';
import {getItem, setItem} from '../func/Storage';

const {width} = Dimensions.get('screen');

export default class RateUs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {data: null, isVisible: false, img: ''};
  }
  setData = async splash => {
    try {
      splash &&
        this.setState({
          data: splash,
          img: splash.image,
          isVisible: this.props.isVisible,
        });
    } catch {}
  };
  componentDidMount = async () => {
    try {
      let RDATA = 'rateData';
      let lang = await getItem('lang', false);
      lang == null && 'en';
      const API = `${R.strings.splashApi}&lang=${lang}&inputlang=${lang}`;
      const data = await getItem(RDATA);
      data && (await this.setData(data));
      const res = await axios(API);
      const {splash = null} = res?.data;
      !data && (await this.setData(splash));
      await setItem(RDATA, splash);
    } catch {}
  };

  onRate = async () => {
    try {
      await setItem('rateus', 'rated');
      this.setState({isVisible: false});
      await Linking.openURL(R.strings.rateURL);
    } catch {}
  };
  render() {
    const {data = {}} = this.state;
    const isVisible = !data?.button ? false : this.state.isVisible;
    return (
      <Overlay
        isVisible={isVisible}
        overlayStyle={{
          padding: 0,
          marginHorizontal: hp(6),
          justifyContent: 'center',
        }}
        animationType="fade"
        onBackdropPress={() => this.setState({isVisible: false})}>
        <View>
          <StatusBar backgroundColor="#000" />
          <View style={{backgroundColor: R.colors.background}}>
            <Image
              source={{uri: data?.image}}
              style={{
                width: width - wp(22),
                height: width - hp(15.4),
                backgroundColor: 'lightgrey',
              }}
            />
            <View style={{padding: hp(1.9)}}>
              <Text style={{fontSize: hp(2.1), color: 'grey'}}>
                {data?.message}
              </Text>
              <Button
                title={data?.button}
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
        </View>
      </Overlay>
    );
  }
}
