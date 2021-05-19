import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import R from '../res/R';
import RadioForm from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';
import {api} from '../func/ApiCalls';
import Loading from '../comp/Loading';
import axios from 'axios';
export default class Language extends React.PureComponent {
  state = {
    radio_props: [],
    lang: 'en',
    navigate: this.props.route?.params?.nav,
    loading: false,
  };
  componentDidMount = async () => {
    try {
      await this.fetchLanguage();
      let lang = await AsyncStorage.getItem('lang').catch(e => {});
      if (lang != null) {
        this.state.radio_props?.map((itm, i) => {
          if (itm?.value === lang) {
            this?.radioForm?.updateIsActiveIndex(i);
          }
        });
      } else {
        this?.radioForm?.updateIsActiveIndex(0);
      }
    } catch {}
  };

  fetchLanguage = async () => {
    this.setState({loading: true});
    try {
      let arr = await AsyncStorage.getItem('languages');
      arr && this.setState({radio_props: JSON.parse(arr), loading: false});

      let {data} = await axios(R.strings.langApi);
      let ar = data?.languages?.map(itm => ({
        label: itm?.name,
        value: itm?.code,
      }));
      !arr && this.setState({radio_props: ar, loading: false});
      await AsyncStorage.setItem('languages', JSON.stringify(ar));
    } catch (e) {
      ToastAndroid.show(R.locale.network, ToastAndroid.SHORT);
    }
  };

  setLanguage = async () => {
    this.setState({loading: true});
    const {lang} = this.state;
    try {
      await AsyncStorage.multiSet([
        ['lang', lang],
        ['langSaw', 'yes'],
      ]);
      await Promise.all([api(lang)]);
      RNRestart.Restart();
    } catch (e) {
      ToastAndroid.show(R.strings.error, ToastAndroid.SHORT);
      this.setState({loading: false});
    }
  };
  render() {
    const {loading} = this.state;
    if (loading) {
      return <Loading load={this} />;
    }
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{'Change \nLanguage'}</Text>
        <ScrollView style={styles.scroll}>
          <RadioForm
            ref={re => (this.radioForm = re)}
            radio_props={this.state.radio_props}
            initial={-1}
            animation={true}
            labelColor={'grey'}
            labelStyle={styles.radioLabel}
            style={styles.radio}
            value={this.state.lang}
            buttonColor={'grey'}
            selectedButtonColor={R.colors.primary}
            onPress={value => {
              typeof value === 'string' && this.setState({lang: value});
            }}
          />
        </ScrollView>
        <View style={styles.buttonBox}>
          <TouchableOpacity
            onPress={() => {
              this.setLanguage();
            }}>
            <View style={styles.buttonSubBox}>
              <Text style={styles.buttonText}>Set language</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, margin: 40, marginTop: 70},
  title: {
    fontFamily: R.fonts.text,
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 40,
  },
  scroll: {marginBottom: 90},
  radioLabel: {
    fontFamily: R.fonts.text,
    fontSize: 20,
    height: 50,
    justifyContent: 'center',
    paddingVertical: 7,
  },
  buttonLabel: {
    height: 70,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  radio: {justifyContent: 'center'},
  buttonSubBox: {
    borderWidth: 0.25,
    borderColor: 'lightgrey',
    borderRadius: 16,
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: R.fonts.text,
    fontSize: 15,
    color: R.colors.primary,
  },
  buttonBox: {
    height: 70,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
});
