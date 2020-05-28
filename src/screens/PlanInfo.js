import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import {HeadText} from '../comp/Home/HeadText';
import {Icon, Button} from 'react-native-elements';
import {ListData} from '../comp/ListData';
import {SimpleList} from '../comp/SimpleList';
import Animated, {event, Value} from 'react-native-reanimated';
import Player from '../comp/Player';
import Orientation from 'react-native-orientation-locker';
import {ContextStates} from '../func/ContextStates';

const {width, height} = Dimensions.get('window');

const Touchable =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

export default class PlanInfo extends React.PureComponent {
  static contextType = ContextStates;
  state = {
    isPlay: false,
    data: [1, 2, 3, 4, 5, 6],
    scrollY: new Value(0),
    player: false,
  };
  componentDidMount = () => {};
  render() {
    const {isPlay} = this.state;

    const backButtX = this.state.scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [20, -70],
    });
    // if (this.state.player)
    //   return (
    //     <Player
    //       set={() =>
    //         this.setState({player: false}, () => Orientation.lockToPortrait())
    //       }
    //     />
    //   );

    return (
      <View style={{flex: 1}}>
        <Animated.ScrollView
          style={styles.constainer}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={event(
            [
              {
                nativeEvent: {contentOffset: {y: this.state.scrollY}},
              },
            ],
            {
              useNativeDriver: true, // <- Native Driver used for animated events
            },
          )}
          contentContainerStyle={styles.cContainer}>
          <Image source={require('../res/imgs/tent.jpg')} style={styles.img} />
          <Touchable
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Animated.View
              style={{
                backgroundColor: '#fff',
                width: 50,
                height: 50,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 10,
                left: backButtX,
              }}>
              <Icon name="keyboard-arrow-left" color="grey" />
            </Animated.View>
          </Touchable>
          <View style={{paddingHorizontal: 20, marginVertical: 20}}>
            <Text style={styles.cardTitle}>Basics</Text>
            <Text style={styles.cardSubTitle}>3-20 MIN MEDITATION</Text>
          </View>
          <Text style={styles.description}>
            Live happier and healthier by learning the fundamentals of
            meditation and mindfulness.
          </Text>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 20,
              flexWrap: 'wrap',
              marginTop: 20,
            }}>
            {this.state.data.map(itm => (
              <View
                style={{
                  alignItems: 'center',
                  marginRight: 22,
                  marginBottom: 10,
                }}
                key={itm}>
                <Icon name="play-circle-outline" size={40} color="darkgrey" />
                <Text style={{fontSize: 14, color: 'darkgrey'}}>{itm}</Text>
              </View>
            ))}
          </View>
          <View style={styles.list}>
            <HeadText title="Techniques" />
            <SimpleList />
            <SimpleList />
          </View>
          <View style={styles.list}>
            <HeadText title="Related" />
            <ListData desc={true} data={this.state.data} />
          </View>
        </Animated.ScrollView>
        <Button
          title="BEGIN COURSE"
          titleStyle={{fontSize: 16}}
          icon={{name: 'play-arrow', color: '#fff'}}
          containerStyle={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
          }}
          buttonStyle={{
            backgroundColor: 'orange',
            borderRadius: 70,
            marginHorizontal: 20,
            paddingVertical: 18,
            overflow: 'hidden',
          }}
          onPress={() => this.context.playVideo()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  constainer: {flex: 1, paddingTop: 40},
  cContainer: {paddingBottom: 180},
  list: {
    width: '100%',
    marginTop: 25,
  },
  img: {width: '95%', height: 230, alignSelf: 'center', borderRadius: 10},
  cardTitle: {
    color: '#5e5a61',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubTitle: {
    color: 'darkgrey',
    fontSize: 14,
  },
  description: {
    color: 'grey',
    fontSize: 16,
    lineHeight: 30,
    marginHorizontal: 20,
  },
});
