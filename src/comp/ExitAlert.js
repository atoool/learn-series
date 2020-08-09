import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  BackHandler,
} from 'react-native';
import Modal from 'react-native-modal';
import {Icon, Button} from 'react-native-elements';
import R from '../res/R';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Touchable =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

export default class ExitAlert extends React.PureComponent {
  state = {show: false};
  render() {
    return (
      <Modal
        isVisible={this.state.show}
        onBackdropPress={() => this.setState({show: false})}
        style={{justifyContent: 'center', alignItems: 'center'}}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0}>
        <View
          style={{
            height: 'auto',
            width: '90%',
            padding: hp(3),
            backgroundColor: R.colors.primary,
            elevation: 5,
            borderRadius: hp(1.3),
            alignItems: 'center',
            shadowRadius: 5,
            shadowOpacity: 0.1,
          }}>
          {/* <StatusBar backgroundColor={'rgba(0,0,0,0.1)'} /> */}

          <Text
            style={{
              color: '#fff',
              fontSize: hp(2.3),
              fontFamily: R.fonts.text,
              margin: hp(2.5),
              textAlign: 'center',
            }}>
            Do you want to exit ?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              width: '80%',
              alignContent: 'space-around',
              justifyContent: 'space-around',
            }}>
            <Button
              buttonStyle={{backgroundColor: 'rgba(0,0,0,0)', paddingBottom: 0}}
              title={'No'}
              onPress={() => this.setState({show: false})}
            />
            <Button
              buttonStyle={{backgroundColor: 'rgba(0,0,0,0)'}}
              title={'Yes'}
              onPress={() => BackHandler.exitApp()}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
