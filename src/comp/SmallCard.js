import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Icon} from 'react-native-elements';

const Touchable =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

export const SmallCard = props => {
  return (
    <View style={{width: '100%', paddingHorizontal: 20}}>
      <Touchable activeOpacity={0.6} onPress={() => props.nav()}>
        <View style={styles.smallCard}>
          <Text style={styles.cardTitle}>Moments of opportunity</Text>
          <Text style={styles.cardSubTitle}>3 - 20 MIN MEDITATION</Text>
          <Icon
            name="play-circle-filled"
            color="#5e5a61"
            containerStyle={styles.playIcon}
          />
        </View>
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  smallCard: {
    borderRadius: 10,
    width: '100%',
    padding: 20,
    backgroundColor: '#fbeee0',
  },
  cardTitle: {
    color: '#5e5a61',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubTitle: {
    color: 'darkgrey',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  playIcon: {
    position: 'absolute',
    right: 20,
    top: 30,
    bottom: 30,
  },
});
