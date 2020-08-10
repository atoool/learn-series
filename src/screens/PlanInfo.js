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
// import Orientation from 'react-native-orientation-locker';
import {ContextStates} from '../func/ContextStates';
import R from '../res/R';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import PremiumCheckFun from '../comp/PremiumCheckFun';

const {width, height} = Dimensions.get('window');

const Touchable =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

export default class PlanInfo extends React.PureComponent {
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
    const premiumPurchased = await PremiumCheckFun.checkPurchased();

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
    this.setState({lesson, chapter, premiumPurchased}, () => {
      const {chapters} = data.lessons[lesson ? lesson - 1 : 0];
      // let videos = [];
      let randomPlans = [];
      for (let i = 0; i < chapters.length; i++) {
        const {explore} = this.context.reduState;
        const random = Math.floor(Math.random() * explore.length);
        if (data.name != explore[random].name)
          randomPlans.push(explore[random]);
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
    const {collapsed, lesson, chapter, premiumPurchased} = this.state;
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
        <Animated.ScrollView
          ref={re => (this.scrollRef = re)}
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
                width: 50,
                height: 50,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                elevation: 5,
                top: 10,
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
          <View style={{paddingHorizontal: 20, marginVertical: 20}}>
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
              padding: 10,
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
                  borderRadius: 10,
                  marginBottom: key === params.data.lessons.length - 1 ? 0 : 10,
                }}>
                <CollapseHeader
                  style={{
                    padding: 20,
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
                      fontSize: 18,
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
                    padding: 10,
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
                        onPressIn={() => {
                          if (
                            premiumPurchased ||
                            params.data.name == reduState.mainPlan[0].name
                          )
                            this.savePlan();
                        }}
                        onPress={() => {
                          if (
                            !premiumPurchased &&
                            params.data.name != reduState.mainPlan[0].name
                          )
                            this.props.navigation.navigate('Premium');
                          else
                            this.props.navigation.navigate('Player', {
                              videos: lessn.chapters,
                              type: params.type,
                              playIndex: keyc,
                              lessons: params.data.lessons.length,
                            });
                        }}>
                        <View
                          style={{
                            padding: 10,
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
                              !premiumPurchased
                                ? params.data.name != reduState.mainPlan[0].name
                                  ? 'lock'
                                  : 'play-circle'
                                : 'play-circle'
                            }
                            size={22}
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
                          <View style={{marginLeft: 10}}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                fontFamily: R.fonts.text,
                                fontSize: 14,
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
                                fontSize: 14,
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
              scroll={() =>
                this.scrollRef
                  ?.getNode()
                  ?.scrollTo({x: 0, y: 0, animated: true})
              }
            />
          </View>
        </Animated.ScrollView>
        <Button
          title="START"
          titleStyle={{
            fontSize: 16,
            color:
              this.props.route.params?.type === 'sleep' ? '#a3aeeb' : '#fff',
            marginLeft: 10,
          }}
          icon={() => (
            <FontAwesome5Icon
              name={
                !premiumPurchased
                  ? params.data.name != reduState.mainPlan[0].name
                    ? 'lock'
                    : 'play'
                  : 'play'
              }
              color={
                this.props.route.params?.type === 'sleep' ? '#a3aeeb' : '#fff'
              }
              size={14}
            />
          )}
          containerStyle={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
            overflow: 'hidden',
          }}
          useForeground
          buttonStyle={{
            backgroundColor: params?.type === 'sleep' ? '#6267a8' : 'orange',
            borderRadius: 70,
            marginHorizontal: 20,
            paddingVertical: 18,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPressIn={() => {
            if (
              premiumPurchased ||
              params.data.name == reduState.mainPlan[0].name
            )
              this.savePlan();
          }}
          onPressOut={() => {
            if (
              !premiumPurchased &&
              params.data.name != reduState.mainPlan[0].name
            )
              this.props.navigation.navigate('Premium');
            else
              this.props.navigation.navigate('Player', {
                videos: params.data.lessons[lesson - 1].chapters,
                type: params.type,
                playIndex: chapter - 1,
                lessons: params.data.lessons.length,
              });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  constainer: {flex: 1, paddingTop: 40, backgroundColor: '#fff'},
  cContainer: {paddingBottom: 180, backgroundColor: '#fff'},
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
    marginBottom: 30,
  },
});
