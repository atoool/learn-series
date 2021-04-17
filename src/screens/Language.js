import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import R from '../res/R';
import RadioForm from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';

const res = {
  languages: [
    {code: 'en', name: 'English'},
    {code: 'fr', name: 'French'},
    {code: 'it', name: 'Italian'},
    {code: 'de', name: 'German'},
  ],
};
export default class Language extends React.PureComponent {
  state = {
    radio_props: [],
    lang: 'en',
    navigate: this.props.route?.params?.nav,
    loading: false,
  };
  componentDidMount = async () => {
    await this.fetchLanguage();
    let lang = await AsyncStorage.getItem('lang').catch(e => {});
    if (lang != null) {
      for (let i = 0; i < this.state.radio_props.length; i++) {
        if (this.state.radio_props[i].value === lang) {
          this.radioForm.updateIsActiveIndex(i);
        }
      }
      this.setState({lang});
    }
  };

  fetchLanguage = async () => {
    this.setState({loading: true});
    // await fetch(
    //   `https://cookbookapp.in/RIA/grid.php?type=isLang&page=isLang&appname=${
    //     R.strings.bundleId
    //   }&versioncode=300&version=123&lang=en&simcountry=us`,
    // )
    //   .then(resJSON => resJSON.json())
    //   .then(async res => {
    let ar = [];
    for (let i = 0; i < res.languages.length; i++) {
      ar.push({label: res.languages[i].name, value: res.languages[i].code});
    }
    this.setState({radio_props: ar, loading: false});
    await AsyncStorage.setItem('languages', JSON.stringify(ar));
    // })
    // .catch(async e => {
    //   let ar = await AsyncStorage.getItem('languages');
    //   ar != null
    //     ? this.setState({radio_props: JSON.stringify(ar), loading: false})
    //     : ToastAndroid.show(R.locale.network, ToastAndroid.SHORT);
    // });
  };

  setLanguage = async () => {
    await AsyncStorage.setItem('lang', this.state.lang)
      .then(() => {
        if (this.props.route?.params?.nav === 'settings') {
          this.props.navigation.pop();
          RNRestart.Restart();
        } else {
          this.props.navigation.navigate('Onboarding');
        }
      })
      .catch(e => {});
    await AsyncStorage.setItem('langSaw', 'yes').catch(e => {});
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, margin: 40, marginTop: 70}}>
        {/* <StatusBar hidden={true} /> */}
        <Text
          style={{fontFamily: R.fonts.text, fontWeight: 'bold', fontSize: 30}}>
          Change
        </Text>
        <Text
          style={{
            fontFamily: R.fonts.text,
            fontWeight: 'bold',
            fontSize: 30,
            marginBottom: 40,
          }}>
          Language
        </Text>
        <ScrollView style={{marginBottom: 90}}>
          {this.state.loading ? (
            <View style={{justifyContent: 'center'}}>
              <ActivityIndicator
                color={R.colors.primary}
                style={{alignSelf: 'center'}}
              />
            </View>
          ) : (
            <RadioForm
              ref={re => (this.radioForm = re)}
              radio_props={this.state.radio_props}
              initial={0}
              animation={true}
              labelColor={'grey'}
              labelStyle={{
                fontFamily: R.fonts.text,
                fontSize: 20,
                height: 50,
                justifyContent: 'center',
                paddingVertical: 7,
              }}
              style={{justifyContent: 'center'}}
              buttonColor={'grey'}
              selectedButtonColor={R.colors.primary}
              onPress={value => {
                this.setState({lang: value});
              }}
            />
          )}
        </ScrollView>
        <View
          style={{
            height: 70,
            position: 'absolute',
            bottom: 0,
            width: '100%',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setLanguage();
            }}>
            <View
              style={{
                borderWidth: 0.25,
                borderColor: 'lightgrey',
                borderRadius: 16,
                width: 150,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: R.fonts.text,
                  fontSize: 15,
                  color: R.colors.primary,
                }}>
                Set language
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
