import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Animated,
  ScrollView,
  ImageBackground,
  Image,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {Card, Icon, Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import R from '../res/R';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';
import {HeadText} from '../comp/Home/HeadText';
import {ListData} from '../comp/ListData';
import {ContextStates} from '../func/ContextStates';

const {height, width} = Dimensions.get('window');

const HEADER_MIN_HEIGHT = height * 0.14;
const HEADER_MAX_HEIGHT = height * 0.32;

export default class ExploreList extends Component {
  static contextType = ContextStates;
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
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });

    const txtOpacity = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, HEADER_MIN_HEIGHT - 60],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    const imageOpacity = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, HEADER_MIN_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    // const headTextX = this.scrollYAnimatedValue.interpolate({
    //   inputRange: [-200, 0, HEADER_MIN_HEIGHT, 500],
    //   outputRange: [wp(4.8), wp(4.8), wp(33), wp(33)],
    //   extrapolate: 'clamp',
    // });
    const headTextY = this.scrollYAnimatedValue.interpolate({
      inputRange: [-200, 0, HEADER_MIN_HEIGHT, 500],
      outputRange: [
        hp(24.6),
        hp(24.6),
        height < 750 ? hp(7.5) : hp(9.5),
        height < 750 ? hp(7.5) : hp(9.5),
      ],
      extrapolate: 'clamp',
    });

    const headTextSize = this.scrollYAnimatedValue.interpolate({
      inputRange: [-200, 0, HEADER_MIN_HEIGHT, 500],
      outputRange: [wp(4.4), wp(4.4), wp(2.8), wp(2.8)],
      extrapolate: 'clamp',
    });

    return (
      <SafeAreaView style={styles.container}>
        {/* <ImageBackground
          style={{flex: 1}}
          source={require('../res/images/background.jpg')}> */}
        <Animated.ScrollView
          style={{flex: 1, backgroundColor: '#f2f2f2'}}
          contentContainerStyle={{
            paddingTop: HEADER_MAX_HEIGHT + 20,
            marginBottom: 0,
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.scrollYAnimatedValue}}}],
            {useNativeDriver: false},
          )}>
          {this.state.data.map((itm, i) => (
            <View style={styles.cardView} key={i}>
              <HeadText title="Calming meditations" />
              <ListData
                data={this.context.reduState.explore}
                small
                desc="Recognize what's occupying your mind and let it go."
              />
              <Button
                title="SHOW MORE (4)"
                titleStyle={{fontSize: 14, color: 'orange'}}
                containerStyle={{
                  width: '100%',
                  marginTop: 20,
                }}
                buttonStyle={{
                  backgroundColor: '#fafaef',
                  borderRadius: 70,
                  marginHorizontal: 20,
                  paddingVertical: 10,
                  overflow: 'hidden',
                }}
                onPress={() =>
                  this.props.navigation.navigate('ExploreFList', {
                    title: 'Calming meditations',
                    data: this.state.data,
                  })
                }
              />
            </View>
          ))}
        </Animated.ScrollView>
        {/* </ImageBackground> */}

        <Animated.View
          style={[
            styles.animatedHeaderContainer,
            {height: headerHeight, backgroundColor: R.colors.primary},
          ]}>
          <Animated.Image
            style={{height: '100%', width: '100%', opacity: imageOpacity}}
            source={require('../res/imgs/special0.jpeg')}
          />
          {/* <SafeAreaView style={{marginTop: hp(-32)}}> */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 50,
              position: 'absolute',
              width: '100%',
            }}>
            <Button
              icon={{name: 'keyboard-backspace', color: '#000'}}
              onPress={() => this.props.navigation.goBack()}
              containerStyle={{width: '15%'}}
              buttonStyle={{backgroundColor: 'rgba(0,0,0,0)'}}
            />
            <Animated.Text
              style={{
                fontSize: 20,
                textAlignVertical: 'center',
                textAlign: 'center',
                width: '70%',
                zIndex: 1,
                color: '#000',
                fontWeight: 'bold',
              }}>
              Meditation
            </Animated.Text>
          </View>
          <Animated.Text
            style={{
              fontSize: 16,
              position: 'absolute',
              alignSelf: 'center',
              marginTop: 100,
              lineHeight: 30,
              margin: 20,
              color: '#000',
              opacity: txtOpacity,
              textAlign: 'center',
              zIndex: 1,
            }}>
            A free selection of meditation, sleep and other experiences designed
            to support you during your current situations
          </Animated.Text>
          {/* </SafeAreaView> */}
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -20,
    paddingBottom: 20,
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
