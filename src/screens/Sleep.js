import React, {PureComponent} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
  SafeAreaView,
  TouchableNativeFeedback,
} from 'react-native';
import {Button} from 'react-native-elements';
import Fireflies from '../comp/Fireflies';
import {ContextStates} from '../func/ContextStates';

const {height, width} = Dimensions.get('window');

const HEADER_MIN_HEIGHT = height * 0.14;
const HEADER_MAX_HEIGHT = height * 0.32;

export default class Sleep extends PureComponent {
  constructor(props) {
    super(props);

    this.scrollYAnimatedValue = new Animated.Value(0);
    this.state = {
      data: [1, 2, 3, 4, 5, 6],
    };
    this.array = [];
  }

  render() {
    const headerHeight = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, HEADER_MIN_HEIGHT],
      outputRange: [-40, -HEADER_MIN_HEIGHT - 90],
      extrapolate: 'clamp',
    });
    const imageOpacity = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, HEADER_MIN_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    const scaleImg1 = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, HEADER_MIN_HEIGHT - 70],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const scaleImg2 = this.scrollYAnimatedValue.interpolate({
      inputRange: [50, HEADER_MIN_HEIGHT],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const topImg = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, HEADER_MIN_HEIGHT],
      outputRange: [20, 65],
      extrapolate: 'clamp',
    });
    return (
      <ContextStates.Consumer>
        {({loader}) => {
          if (loader)
            return <View style={{flex: 1, backgroundColor: '#000'}} />;

          return (
            <SafeAreaView style={styles.container}>
              <Animated.FlatList
                style={{flex: 1, backgroundColor: '#1e265f'}}
                contentContainerStyle={{
                  paddingTop: HEADER_MAX_HEIGHT + 20,
                }}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {y: this.scrollYAnimatedValue},
                      },
                    },
                  ],
                  {useNativeDriver: true},
                )}
                data={this.state.data}
                keyExtractor={(itm, indx) => indx.toString()}
                renderItem={({item, index}) => (
                  <View style={{padding: 10}}>
                    <TouchableNativeFeedback
                      key={index}
                      onPress={() => {
                        this.props.navigation.navigate('ExploreFList', {
                          title: 'Sleepcasts',
                          data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                        });
                      }}>
                      <View
                        style={{
                          padding: 20,
                          width: '100%',
                          borderRadius: 16,
                          backgroundColor: '#3b3282',
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            color: 'green',
                            fontWeight: 'bold',
                            marginBottom: 10,
                          }}>
                          Sleepcasts
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#8082cf',
                            lineHeight: 25,
                          }}>
                          Ever-changing story telling in a range of soothing
                          voices.
                        </Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                )}
                ListFooterComponent={() => (
                  <View
                    style={{
                      height: 300,
                      width: width,
                    }}>
                    <Fireflies>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 20,
                          margin: 20,
                          marginBottom: 10,
                          color: '#8082cf',
                          textAlign: 'center',
                          paddingTop: 40,
                        }}>
                        Too tired to choose?
                      </Text>
                      <Button
                        title="PLAY RANDOM"
                        titleStyle={{fontSize: 14, color: '#8082cf'}}
                        icon={{name: 'play-arrow', color: '#8082cf'}}
                        containerStyle={{width: '50%', alignSelf: 'center'}}
                        buttonStyle={{
                          backgroundColor: '#3b3282',
                          borderRadius: 70,
                          paddingHorizontal: 15,
                          paddingVertical: 10,
                          overflow: 'hidden',
                        }}
                        onPress={() => this.props.navigation.navigate('Player')}
                      />
                    </Fireflies>
                  </View>
                )}
              />

              <Animated.View
                style={[
                  styles.animatedHeaderContainer,
                  {
                    transform: [{translateY: headerHeight}],
                    backgroundColor: '#1e265f',
                    height: 300,
                  },
                ]}>
                <Animated.Image
                  style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: '#1e265f',
                    opacity: imageOpacity,
                  }}
                  // source={require('../res/imgs/moon.png')}
                />
                {/* <SafeAreaView style={{marginTop: hp(-32)}}> */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    transform: [{translateY: topImg}],
                  }}>
                  <Animated.Image
                    style={{
                      height: 90,
                      width: 100,
                      top: 150,
                      transform: [{scale: scaleImg1}],
                    }}
                    source={require('../res/imgs/moon.png')}
                  />
                  <Animated.Image
                    style={{
                      height: 50,
                      width: 80,
                      top: 90,
                      transform: [{scale: scaleImg2}],
                    }}
                    source={require('../res/imgs/fmoon.png')}
                  />
                </Animated.View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 50,
                    position: 'absolute',
                    width: '100%',
                  }}
                />
                {/* </SafeAreaView> */}
              </Animated.View>
            </SafeAreaView>
          );
        }}
      </ContextStates.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -20,
    backgroundColor: '#1e265f',
  },
  cardView: {
    width: '100%',
    paddingTop: 30,
  },
  animatedHeaderContainer: {
    position: 'absolute',
    top: Platform.OS == 'ios' ? 20 : 0,
    left: 0,
    right: 0,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
  },
  item: {
    backgroundColor: '#ff9e80',
    margin: 8,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: 'black',
    fontSize: 16,
  },
});
