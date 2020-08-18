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
  StatusBar,
} from 'react-native';
import {HeadText} from '../comp/Home/HeadText';
import {Icon, Button} from 'react-native-elements';
import {ListData} from '../comp/ListData';
import {SimpleList} from '../comp/SimpleList';
import Animated, {event, Value} from 'react-native-reanimated';
import {ContextStates} from '../func/ContextStates';
import R from '../res/R';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {checkPurchased} from '../comp/PremiumCheckFun';
import {isEqual} from 'lodash';
import Orientation from 'react-native-orientation-locker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');

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
    purchasedPremium: false,
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
    const purchasedPremium = await checkPurchased();

    let {data, type} = this.props.route.params;
    let lesson = 1;
    let chapter = 1;
    if (type == 'sleep') {
      const {sleepPr} = this.context.reduState;
      sleepPr.map((itm, i) => {
        if (data.name == itm.plan) {
          lesson = itm.lesson ? itm.lesson : 1;
          chapter = itm.chapter ? itm.chapter : 1;
        }
      });
    } else {
      const {session} = this.context.reduState;
      session.map((itm, i) => {
        if (data.name == itm.plan) {
          lesson = itm.lesson ? itm.lesson : 1;
          chapter = itm.chapter ? itm.chapter : 1;
        }
      });
    }
    this.setState({lesson, chapter, purchasedPremium}, () => {
      const {chapters} = data.lessons[lesson ? lesson - 1 : 0];
      // let videos = [];
      let randomPlans = [];
      const {explore} = this.context.reduState;
      for (let i = 0; i < 4; i++) {
        const random = Math.floor(Math.random() * explore.length);
        const length = randomPlans.filter(r => r.name == explore[random].name)
          .length;
        if (data.name != explore[random].name && length == 0)
          randomPlans.push(explore[random]);
        else i--;
      }

      // this.context.dispatch({type: 'videos', payload: videos});
      this.setState({
        randomPlans,
      });
    });
  };

  savePlan = () => {
    const {collapsed, lesson, chapter} = this.state;
    const {params} = this.props.route;
    const {type} = params;
    const {reduState, dispatch} = this.context;
    // if (chaps) {
    //   let videos = [];
    //   let randomPlans = [];
    //   for (let i = 0; i < chaps.length; i++) videos.push(chaps[i].video);
    //   dispatch({type: 'videos', payload: videos});
    // }
    if (params.type == 'sleep') {
      let sess = reduState.sleepPr;
      let index = sess.length - 1;
      let session = sess.filter((t, i) => {
        t.plan == params.data.name && (index = i);
        return t.plan == params.data.name;
      });
      session?.length != 0
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
      sess.length == 3 && sess.pop();
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
    const {collapsed, lesson, chapter, purchasedPremium} = this.state;
    const {params} = this.props.route;
    const {type} = params;
    const {reduState, playVideo} = this.context;
    const chapTitles =
      type == 'home'
        ? reduState.titHome
        : type == 'sleep'
        ? reduState.titSleep
        : reduState.titExplore;
    const chapDesc =
      type == 'home'
        ? reduState.descHome
        : type == 'sleep'
        ? reduState.descSleep
        : reduState.descExplore;
    const planImg =
      type == 'home'
        ? reduState.imgHome
        : type == 'sleep'
        ? reduState.imgSleep
        : reduState.imgExplore;
    const backButtX = this.state.scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [20, -70],
      extrapolate: 'clamp',
    });

    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            this.props.route.params?.type == 'sleep' ? '#1e265f' : '#fff',
        }}>
        <StatusBar backgroundColor={R.colors.statusBar} />
        <Animated.ScrollView
          ref="scrollRef"
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
          contentContainerStyle={[styles.cContainer, {opacity: 1}]}>
          <Image
            source={{
              uri: planImg[params.data.coverImage],
            }}
            style={styles.img}
          />
          <Touchable
            onPress={() => {
              this.props.navigation.goBack();
            }}
            useForeground>
            <Animated.View
              style={{
                backgroundColor:
                  this.props.route.params?.type === 'sleep'
                    ? '#1e265f'
                    : '#fff',
                width: wp(13.9),
                height: hp(6.4),
                borderRadius: hp(5.1),
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                elevation: 5,
                top: hp(1.3),
                left: backButtX,
                overflow: 'hidden',
              }}>
              <Icon
                name="keyboard-arrow-left"
                color={
                  this.props.route.params?.type === 'sleep' ? '#a3aeeb' : 'grey'
                }
              />
            </Animated.View>
          </Touchable>
          <View style={{paddingHorizontal: wp(5.6), marginVertical: hp(2.6)}}>
            <Text
              style={[
                styles.cardTitle,
                params?.type === 'sleep' && {color: '#a3aeeb'},
              ]}>
              {params.data.name}
            </Text>
            <Text
              style={[
                styles.cardSubTitle,
                params?.type === 'sleep' && {color: '#a3aeeb'},
              ]}>
              {params.data.lessons.length} LESSONS
            </Text>
          </View>
          <Text
            style={[
              styles.description,
              params?.type === 'sleep' && {color: '#6267a8'},
            ]}>
            {params.data.lessons[0].desc}
          </Text>
          <View
            style={{
              width: '100%',
              padding: hp(1.3),
              backgroundColor: params?.type === 'sleep' ? '#32407b' : '#eee',
            }}>
            {params.data.lessons.map((lessn, key) => (
              <Collapse
                isCollapsed={
                  collapsed[key]
                    ? collapsed[key]
                    : key == (lesson ? lesson - 1 : 0)
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
                  backgroundColor:
                    this.props.route.params?.type === 'sleep'
                      ? '#1e265f'
                      : '#fff',
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
                      color:
                        this.props.route.params?.type === 'sleep'
                          ? '#a3aeeb'
                          : '#5e5a61',
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
                    color={params?.type === 'sleep' ? '#a3aeeb' : '#5e5a61'}
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
                            ? key == lesson - 1
                              ? keyc < chapter
                                ? false
                                : true
                              : false
                            : true
                        }
                        onPress={() => {
                          if (!purchasedPremium && params.data.premium)
                            this.props.navigation.navigate('Premium');
                          else {
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
                            // marginBottom: 10,
                            flexDirection: 'row',
                          }}>
                          <FontAwesome5Icon
                            solid={
                              key < lesson
                                ? key == lesson - 1
                                  ? keyc < chapter
                                    ? true
                                    : false
                                  : true
                                : false
                            }
                            name={
                              !purchasedPremium
                                ? params.data.premium
                                  ? 'lock'
                                  : 'play-circle'
                                : 'play-circle'
                            }
                            size={hp(2.8)}
                            color={
                              params?.type === 'sleep'
                                ? '#a3aeeb'
                                : key < lesson
                                ? key == lesson - 1
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
                                color:
                                  params?.type === 'sleep'
                                    ? '#a3aeeb'
                                    : '#5e5a61',
                              }}>
                              {chapTitles[chaps.title]}
                            </Text>
                            <Text
                              style={{
                                fontFamily: R.fonts.text,
                                color:
                                  this.props.route.params?.type === 'sleep'
                                    ? '#6267a8'
                                    : 'darkgrey',
                                fontSize: hp(1.8),
                              }}>
                              {chapDesc[chaps.desc]}
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
          {/* <View style={styles.list}>
            <HeadText title="Techniques" type={this.props.route.params?.type} />
            <SimpleList
              type={this.props.route.params?.type}
              title={'title'}
              image={''}
            />
            <SimpleList
              type={this.props.route.params?.type}
              title={'title'}
              image={''}
            />
          </View> */}
          <View style={styles.list}>
            <HeadText title="Related" type={params?.type} />

            <ListData
              data={this.state.randomPlans}
              type={params?.type}
              scroll={this.refs.scrollRef && this}
            />
          </View>
        </Animated.ScrollView>
        <Button
          title="START"
          titleStyle={{
            fontSize: hp(2.1),
            color:
              this.props.route.params?.type === 'sleep' ? '#a3aeeb' : '#fff',
            marginLeft: wp(2.8),
          }}
          icon={() => (
            <FontAwesome5Icon
              name={
                !purchasedPremium
                  ? params.data.premium
                    ? 'lock'
                    : 'play'
                  : 'play'
              }
              color={
                this.props.route.params?.type === 'sleep' ? '#a3aeeb' : '#fff'
              }
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
            backgroundColor: params?.type === 'sleep' ? '#6267a8' : 'orange',
            borderRadius: hp(9),
            marginHorizontal: wp(5.6),
            paddingVertical: hp(2.3),
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (!purchasedPremium && params.data.premium)
              this.props.navigation.navigate('Premium');
            else {
              this.savePlan();
              this.props.navigation.navigate('Player', {
                videos: params.data.lessons[lesson - 1].chapters,
                type: params.type,
                chapter: chapter - 1,
                lesson: lesson,
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
  constainer: {flex: 1, paddingTop: hp(4.1), backgroundColor: '#fff'},
  cContainer: {paddingBottom: hp(23.1), backgroundColor: '#fff'},
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
});
