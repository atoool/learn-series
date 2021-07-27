import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import {HeadText} from '../comp/Home/HeadText';
import {Icon, Button} from 'react-native-elements';
import {ListData} from '../comp/ListData';
import Animated, {event, Value} from 'react-native-reanimated';
import {ContextStates} from '../func/ContextStates';
import R from '../res/R';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Orientation from 'react-native-orientation-locker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Touchable =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

export default class PlanInfo extends React.Component {
  static contextType = ContextStates;
  state = {
    isPlay: false,
    randomPlans: [],
    scrollY: new Value(0),
    player: false,
    collapsed: [],
    lesson: 1,
    chapter: 1,
    premiumPurchased: false,
  };

  componentDidMount = () => {
    this.onMount();
    this.onFocus = this.props.navigation.addListener('focus', this.onMount);
  };

  componentWillUnmount = () => {
    this.onFocus();
  };

  onMount = async () => {
    Orientation.lockToPortrait();
    const {premiumPurchased} = this.context.reduState;

    let {data} = this.props.route.params;
    let lesson = 1;
    let chapter = 1;
    const {session} = this.context.reduState;
    session.map((itm, i) => {
      if (data.name === itm.plan) {
        lesson = itm.lesson ? itm.lesson : 1;
        chapter = itm.chapter ? itm.chapter : 1;
      }
    });
    this.setState({lesson, chapter, premiumPurchased}, () => {
      let randomPlans = [];
      const {explore} = this.context.reduState;
      for (let i = 0; i < 4; i++) {
        const random = Math.floor(Math.random() * explore.length);
        const length = randomPlans.filter(
          r => r.name === explore[random].name,
        ).length;
        if (data.name !== explore[random].name && length === 0) {
          randomPlans.push(explore[random]);
        } else {
          i--;
        }
      }

      this.setState({
        randomPlans,
      });
    });
  };

  savePlan = () => {
    const {lesson, chapter} = this.state;
    const {params} = this.props.route;
    const {reduState, dispatch} = this.context;
    if (params.type === 'sleep') {
      let sess = reduState.sleepPr;
      let index = sess.length - 1;
      let session = sess.filter((t, i) => {
        t.plan === params.data.name && (index = i);
        return t.plan === params.data.name;
      });
      session?.length !== 0
        ? (sess[index] = {
            plan: params.data.name,
            lesson: lesson ? lesson : 1,
            chapter: chapter ? chapter : 1,
          })
        : sess.push({
            plan: params.data.name,
            lesson: lesson ? lesson : 1,
            chapter: chapter ? chapter : 1,
          });
      dispatch({type: 'sleepSess', payload: [...sess]});
    } else {
      let sess = reduState.session;
      sess.length === 3 && sess.pop();
      let session = sess.filter(t => t.plan !== params.data.name);
      session = [
        {
          plan: params.data.name,
          lesson: lesson ? lesson : 1,
          chapter: chapter ? chapter : 1,
        },
        ...session,
      ];

      dispatch({type: 'session', payload: [...session]});
    }
  };

  render() {
    const {collapsed, lesson, chapter, premiumPurchased} = this.state;
    const {params} = this.props.route;
    const backButtX = this.state.scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [20, -70],
      extrapolate: 'clamp',
    });
    const isInSession =
      this?.context?.reduState?.myCourse?.filter(
        i => i?.name === params?.data?.name,
      ).length !== 0;

    return (
      <View style={styles.mainContainer}>
        <StatusBar backgroundColor={R.colors.statusBar} />
        <Animated.ScrollView
          ref={r => (this.scrollRef = r)}
          style={styles.container}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            {useNativeDriver: true},
          )}
          contentContainerStyle={styles.cContainer}>
          <Image source={{uri: params.data.coverImage}} style={styles.img} />
          <Touchable
            onPress={() => {
              this.props.navigation.goBack();
            }}
            useForeground>
            <Animated.View style={[styles.animatedBox, {left: backButtX}]}>
              <Icon name="keyboard-arrow-left" color={'grey'} />
            </Animated.View>
          </Touchable>
          <View style={{paddingHorizontal: wp(5.6), marginVertical: hp(2.6)}}>
            <Text style={[styles.cardTitle]}>{params.data.name}</Text>
            <Text style={[styles.cardSubTitle]}>
              {params.data.lessons.length} {R.locale.lessons}
            </Text>
          </View>
          <Text style={[styles.description]}>{params.data.description}</Text>
          <View style={styles.accordionBox}>
            {params.data.lessons.map((lessn, key) => (
              <Collapse
                isExpanded={
                  collapsed[key]
                    ? collapsed[key]
                    : key === (lesson ? lesson - 1 : 0)
                }
                onToggle={colps => {
                  collapsed[key] = colps;
                  this.setState({
                    collapsed: [...collapsed],
                  });
                }}
                key={key}
                style={{
                  width: '100%',
                  backgroundColor: R.colors.background,
                  borderRadius: hp(1.3),
                  marginBottom:
                    key === params.data.lessons.length - 1 ? 0 : hp(1.3),
                }}>
                <CollapseHeader
                  style={{
                    padding: hp(2.6),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontFamily: R.fonts.primary,
                      fontWeight: 'bold',
                      color: '#5e5a61',
                      fontSize: hp(2.3),
                    }}>
                    {lessn.title}
                  </Text>
                  <Icon
                    name={
                      collapsed[key]
                        ? 'keyboard-arrow-up'
                        : 'keyboard-arrow-down'
                    }
                    color={'#5e5a61'}
                  />
                </CollapseHeader>
                <CollapseBody
                  activeOpacity={0.6}
                  style={{
                    padding: hp(1.3),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      width: '80%',
                    }}>
                    {lessn.chapters.map((chaps, keyc) => (
                      <TouchableOpacity
                        activeOpacity={0.6}
                        key={keyc}
                        disabled={
                          key < lesson
                            ? key === lesson - 1
                              ? keyc < chapter
                                ? false
                                : true
                              : false
                            : true
                        }
                        onPress={() => {
                          if (!premiumPurchased && params.data.premium) {
                            this.props.navigation.navigate('Premium');
                          } else {
                            this.savePlan();
                            this.props.navigation.navigate('Player', {
                              videos: lessn.chapters,
                              type: params.type,
                              chapter: keyc,
                              lesson: key + 1,
                              lessons: params.data.lessons.length,
                            });
                          }
                        }}>
                        <View
                          style={{
                            padding: hp(1.3),
                            flexDirection: 'row',
                          }}>
                          <FontAwesome5Icon
                            solid={
                              key < lesson
                                ? key === lesson - 1
                                  ? keyc < chapter
                                    ? true
                                    : false
                                  : true
                                : false
                            }
                            name={
                              !premiumPurchased
                                ? params.data.premium
                                  ? 'lock'
                                  : 'play-circle'
                                : 'play-circle'
                            }
                            size={hp(2.8)}
                            color={
                              key < lesson
                                ? key === lesson - 1
                                  ? keyc < chapter
                                    ? '#5e5a61'
                                    : 'darkgrey'
                                  : '#5e5a61'
                                : 'darkgrey'
                            }
                          />
                          <View style={{marginLeft: wp(2.8)}}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                fontFamily: R.fonts.text,
                                fontSize: hp(1.8),
                                color: '#5e5a61',
                              }}>
                              {chaps.title}
                            </Text>
                            <Text
                              style={{
                                fontFamily: R.fonts.text,
                                color: 'darkgrey',
                                fontSize: hp(1.8),
                              }}>
                              {chaps.description}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </CollapseBody>
              </Collapse>
            ))}
          </View>
          <View style={styles.list}>
            <HeadText title={R.locale.related} type={params?.type} />

            <ListData
              data={this.state.randomPlans}
              type={params?.type}
              scroll={this.scrollRef && this}
            />
          </View>
        </Animated.ScrollView>
        <Button
          title={R.locale.start}
          titleStyle={{
            fontSize: hp(2.1),
            color: '#fff',
            marginLeft: wp(2.8),
          }}
          icon={() => (
            <FontAwesome5Icon
              name={
                !premiumPurchased
                  ? params.data.premium
                    ? 'lock'
                    : 'play'
                  : 'play'
              }
              color={'#fff'}
              size={hp(1.8)}
            />
          )}
          containerStyle={{
            position: 'absolute',
            bottom: hp(2.6),
            width: '100%',
            overflow: 'hidden',
          }}
          useForeground
          buttonStyle={{
            backgroundColor: 'orange',
            borderRadius: hp(9),
            marginHorizontal: wp(5.6),
            paddingVertical: hp(2.3),
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (!premiumPurchased && params.data.premium) {
              this.props.navigation.navigate('Premium');
            } else {
              this.savePlan();
              this.props.navigation.navigate('Player', {
                videos: params.data.lessons[lesson - 1].chapters,
                type: params.type,
                chapter: chapter - 1,
                lesson: isInSession ? lesson : 1,
                lessons: params.data.lessons.length,
              });
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: R.colors.background,
  },
  container: {
    flex: 1,
    paddingTop: hp(4.1),
    backgroundColor: R.colors.background,
  },
  cContainer: {
    paddingBottom: hp(23.1),
    backgroundColor: R.colors.background,
    opacity: 1,
  },
  list: {
    width: '100%',
    marginTop: hp(3.2),
  },
  img: {
    width: '95%',
    height: hp(29.5),
    alignSelf: 'center',
    borderRadius: hp(1.3),
    backgroundColor: R.colors.img,
  },
  cardTitle: {
    color: '#5e5a61',
    fontSize: hp(4.1),
    fontWeight: 'bold',
    marginBottom: hp(0.6),
  },
  cardSubTitle: {
    color: 'darkgrey',
    fontSize: hp(1.7),
  },
  description: {
    color: 'grey',
    fontSize: hp(2.1),
    lineHeight: hp(3.9),
    marginHorizontal: wp(5.6),
    marginBottom: hp(3.9),
  },
  animatedBox: {
    backgroundColor: R.colors.background,
    width: wp(13.9),
    height: hp(6.4),
    borderRadius: hp(5.1),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    elevation: 5,
    top: hp(1.3),
    overflow: 'hidden',
  },
  accordionBox: {
    width: '100%',
    padding: hp(1.3),
    backgroundColor: R.colors.underlay,
  },
});
