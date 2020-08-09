import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
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

export const AlertModal = props => {
  return (
    <Modal
      isVisible={props.that?.state.showModal}
      onBackdropPress={() =>
        props.that?.setState({showModal: false, popup: ''})
      }
      style={{justifyContent: 'center', alignItems: 'center'}}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0}>
      <View
        style={{
          height: 'auto',
          width: '90%',
          paddingBottom: hp(3.9),
          backgroundColor: R.colors.primary,
          elevation: 5,
          borderRadius: hp(1.3),
          alignItems: 'center',
          shadowRadius: 5,
          shadowOpacity: 0.1,
        }}>
        {/* <StatusBar backgroundColor={'rgba(0,0,0,0.1)'} /> */}
        <Touchable
          activeOpacity={0.6}
          onPress={() => props.that?.setState({showModal: false, popup: ''})}
          style={[Platform.OS === 'ios' ? {alignSelf: 'flex-end'} : {}]}>
          <View style={{alignSelf: 'flex-end', margin: hp(2.5)}}>
            <Icon name="close" color="#fff" />
          </View>
        </Touchable>

        <Text
          style={{
            color: '#fff',
            fontSize: hp(2.3),
            fontFamily: R.fonts.text,
            margin: hp(2.5),
            textAlign: 'center',
          }}>
          {props.that?.state.alertTxt}
        </Text>
      </View>
    </Modal>
  );
};
