import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  Image,
  TouchableNativeFeedback,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import Share from 'react-native-share';
import {checkPurchased} from '../comp/PremiumCheckFun';
import R from '../res/R';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import NotificationService from '../comp/NotificationService';
import {AlertModal} from '../comp/AlertModal';
import {ContextStates} from '../func/ContextStates';
import {useScrollToTop} from '@react-navigation/native';

const Touchable =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

class Settings extends Component {
  static contextType = ContextStates;
  state = {
    premiumPurchased: false,
    notific: R.locale.on,
    shareOptions: {
      title: R.locale.appName,
      message: R.locale.shareSub,
      url: R.strings.rateURL,
      showModal: false,
      alertTxt: '',
    },
    array: [
      {
        image: require(`../res/imgs/premium_crown.png`),
        title: R.locale.getPremium1,
      },
      {image: require(`../res/imgs/pencil.png`), title: R.locale.scp},
      // {image: require('../res/imgs/bell.png'), title: R.locale.Notification},
      // {image: require(`../res/imgs/lang.png`), title: R.locale.lang},
      {image: require(`../res/imgs/privacy.png`), title: R.locale.spp},
      {image: require(`../res/imgs/terms.png`), title: R.locale.stu},
      {image: require(`../res/imgs/tellfriend.png`), title: R.locale.stf},
      {image: require(`../res/imgs/rate.png`), title: R.locale.rate},
    ],
  };
  componentDidMount = async () => {
    let premiumPurchased = await checkPurchased();

    this.setState({premiumPurchased});
    this.getNotific();

    this.props.navigation.addListener('focus', async () => {
      let premiumPurchased = await checkPurchased();
      // this.context.iapData,
      this.setState({premiumPurchased});
      // this.getNotific();
    });
  };

  componentWillUnmount = () => {};

  getNotific = async () => {
    let notific = await AsyncStorage.getItem('notificat').catch(e => {});
    notific &&
      this.setState({notific: notific === 'ON' ? R.locale.on : R.locale.off});
  };
  onNotific = async () => {
    await NotificationService.normalNotification();
    await this.getNotific();
  };

  offNotific = async () => {
    await NotificationService.cancelNormalNotification();
    await this.getNotific();
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
        <ScrollView
          contentContainerStyle={{justifyContent: 'space-around'}}
          ref={this.props.scrollRef}>
          <Image
            style={{height: hp(31.3), width: '100%', marginBottom: hp(3.2)}}
            source={require('../res/imgs/settings.png')}
          />
          <View style={{flex: 1, justifyContent: 'space-around'}}>
            {this.state.array.map((item, index) => {
              return (
                <View key={index}>
                  <Touchable
                    onPress={() => {
                      item.title === R.locale.stf
                        ? Share.open(this.state.shareOptions).catch(err => {})
                        : item.title === 'Rate us'
                        ? Linking.openURL(R.strings.rateURL).catch(err => {})
                        : item.title === R.locale.scp
                        ? this.props.navigation.navigate('ChangePref')
                        : item.title === R.locale.getPremium1
                        ? this.state.premiumPurchased
                          ? this.setState({
                              showModal: true,
                              alertTxt: R.locale.sPAlert,
                            })
                          : this.props.navigation.navigate('Premium')
                        : item.title === R.locale.spp
                        ? this.props.navigation.navigate('Privacy', {
                            type: 'settings',
                          })
                        : item.title === R.locale.stu &&
                          this.props.navigation.navigate('Terms', {
                            type: 'settings',
                          });
                      // : item.title === R.locale.lang
                      // ? this.props.navigation.navigate('Language')
                      // item.title === R.locale.Notification &&
                      //   this.state.notific === R.locale.on
                      // ? this.offNotific()
                      // : this.onNotific();
                    }}>
                    <View style={Style.buttonView}>
                      <View style={Style.buttonImageView}>
                        <Image source={item.image} style={Style.buttonImage} />
                      </View>
                      <Text style={Style.buttonText}>
                        {item.title === R.locale.getPremium1
                          ? this.state.premiumPurchased
                            ? R.locale.getPremium2
                            : item.title
                          : item.title}
                      </Text>
                      {item.title === R.locale.Notification ? (
                        <View style={{flex: 1}}>
                          <Text
                            style={[
                              Style.buttonText,
                              {
                                marginVertical: hp(1.8),
                                fontSize: hp(2.2),
                              },
                            ]}>
                            {this.state.notific}
                          </Text>
                        </View>
                      ) : (
                        <Icon
                          name={
                            item.title === R.locale.getPremium1
                              ? this.state.premiumPurchased
                                ? 'done'
                                : 'keyboard-arrow-right'
                              : 'keyboard-arrow-right'
                          }
                          // type="material"
                          color={
                            item.title === R.locale.getPremium1
                              ? this.state.premiumPurchased
                                ? 'lightgreen'
                                : 'lightgrey'
                              : 'lightgrey'
                          }
                          containerStyle={Style.buttonArrow}
                        />
                      )}
                    </View>
                  </Touchable>
                  {index === 6 && (
                    <Text
                      style={{
                        fontFamily: R.fonts.text,
                        fontSize: hp(1.7),
                        fontWeight: '200',
                        margin: hp(2.1),
                        marginTop: 0,
                        color: 'grey',
                      }}>
                      {R.locale.launchText}
                    </Text>
                  )}
                </View>
              );
            })}
            <Touchable
              onPress={() => {
                Linking.openURL(
                  Platform.OS == 'ios'
                    ? 'https://apps.apple.com/in/developer/riafy-technologies-pvt-ltd/id918478397'
                    : 'https://play.google.com/store/apps/developer?id=Riafy+Technologies',
                ).catch(err => {});
              }}>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  height: hp(6.7),
                  marginBottom: hp(2.1),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: R.fonts.text,
                    fontWeight: '200',
                    fontSize: hp(2.1),
                    color: 'red',
                  }}>
                  {R.locale.more}
                </Text>
              </View>
            </Touchable>
            <View
              style={{width: '100%', alignItems: 'center', marginTop: hp(2.1)}}>
              <Text
                style={{
                  fontFamily: R.fonts.text,
                  fontSize: hp(1.7),
                  color: 'lightgrey',
                }}>
                {R.strings.version}
              </Text>
            </View>
          </View>
        </ScrollView>
        <AlertModal that={this} />
      </View>
    );
  }
}

const Style = StyleSheet.create({
  buttonView: {
    flex: 1,
    marginBottom: hp(3.2),
    backgroundColor: 'white',
    height: hp(6.7),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowRadius: 1,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
  },
  buttonText: {
    fontFamily: R.fonts.textNormal,
    fontWeight: '200',
    fontSize: hp(2.1),
    color: '#000000',
    textAlign: 'left',
    flex: 3,
    marginLeft: hp(2.5),
  },
  buttonArrow: {flex: 1},
  buttonImageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  buttonImage: {width: hp(3.9), height: hp(3.9)},
});

export default function(props) {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return <Settings {...props} scrollRef={ref} />;
}
