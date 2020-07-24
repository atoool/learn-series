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
  };
  componentDidMount = () => {
    this.onMount();
    this.onFocus = this.props.navigation.addListener('focus', this.onMount);
  };
  componentWillUnmount = () => {
    this.onFocus();
  };
  onMount = () => {
    let {data, type} = this.props.route.params;
    let lesson;
    let chapter;
    if (type == 'sleep') {
      const {sleepPr} = this.context.reduState;
      sleepPr.map((itm, i) => {
        if (data.name == itm.plan) {
          lesson = sleepPr[i].lesson;
          chapter = sleepPr[i].chapter;
        }
      });
    } else {
      const {session} = this.context.reduState;
      session.map((itm, i) => {
        if (data.name == itm.plan) {
          lesson = session[i].lesson;
          chapter = session[i].chapter;
        }
      });
    }
    this.setState({lesson, chapter}, () => {
      const {chapters} = data.lessons[lesson ? lesson - 1 : 0];
      let videos = [];
      let randomPlans = [];
      for (let i = 0; i < chapters.length; i++) {
        videos.push(chapters[i].video);
        if (i < 6)
          randomPlans.push(
            this.context.reduState.explore[
              Math.floor(Math.random() * this.context.reduState.explore.length)
            ],
          );
      }

      this.context.dispatch({type: 'videos', payload: videos});
      this.setState({
        randomPlans,
      });
    });
  };
  render() {
    const {collapsed, lesson, chapter} = this.state;
    const {params} = this.props.route;
    const {reduState} = this.context;

    const backButtX = this.state.scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [20, -70],
    });

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: !this.props.route.params?.type ? '#fff' : '#1e265f',
        }}>
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
          <Image
            source={{
              uri: isNaN(params.data.coverImage)
                ? params.data.coverImage
                : R.strings.defaultImg,
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
                this.props.route.params?.type === 'sleep' && {color: '#a3aeeb'},
              ]}>
              {params.data.name}
            </Text>
            <Text
              style={[
                styles.cardSubTitle,
                this.props.route.params?.type === 'sleep' && {color: '#a3aeeb'},
              ]}>
              {params.data.lessons.length} LESSONS
            </Text>
          </View>
          <Text
            style={[
              styles.description,
              this.props.route.params?.type === 'sleep' && {color: '#6267a8'},
            ]}>
            {reduState.desc[0]}
          </Text>
          <View
            style={{
              width: '100%',
              padding: 10,
              backgroundColor:
                this.props.route.params?.type === 'sleep' ? '#32407b' : '#eee',
            }}>
            {params.data.lessons.map((lessons, key) => (
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
                      fontSize: 16,
                    }}>
                    {lessons.title}
                  </Text>
                  <Icon
                    name={
                      collapsed[key]
                        ? 'keyboard-arrow-up'
                        : 'keyboard-arrow-down'
                    }
                    color={
                      this.props.route.params?.type === 'sleep'
                        ? '#a3aeeb'
                        : '#5e5a61'
                    }
                  />
                </CollapseHeader>
                <CollapseBody
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    flexWrap: 'wrap',
                  }}>
                  <Text
                    style={{
                      fontFamily: R.fonts.primary,
                      color:
                        this.props.route.params?.type === 'sleep'
                          ? '#a3aeeb'
                          : '#5e5a61',
                      fontSize: 12,
                    }}>
                    {lessons.desc}
                  </Text>
                  {lessons.chapters.map((chaps, keyc) => (
                    <View
                      style={{
                        alignItems: 'center',
                        marginRight: 22,
                        marginBottom: 10,
                      }}
                      key={keyc}>
                      <Icon
                        name={
                          key < lesson
                            ? keyc < chapter
                              ? 'play-circle-filled'
                              : 'play-circle-outline'
                            : 'play-circle-outline'
                        }
                        size={40}
                        color={
                          this.props.route.params?.type === 'sleep'
                            ? '#a3aeeb'
                            : key < lesson
                            ? keyc < chapter
                              ? '#5e5a61'
                              : 'darkgrey'
                            : 'darkgrey'
                        }
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color:
                            this.props.route.params?.type === 'sleep'
                              ? '#6267a8'
                              : 'darkgrey',
                        }}>
                        {keyc + 1}
                      </Text>
                    </View>
                  ))}
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
            <HeadText title="Related" type={this.props.route.params?.type} />

            <ListData
              data={this.state.randomPlans}
              type={this.props.route.params?.type}
            />
          </View>
        </Animated.ScrollView>
        <Button
          title="START"
          titleStyle={{
            fontSize: 16,
            color:
              this.props.route.params?.type === 'sleep' ? '#a3aeeb' : '#fff',
          }}
          icon={{
            name: 'play-arrow',
            color:
              this.props.route.params?.type === 'sleep' ? '#a3aeeb' : '#fff',
          }}
          containerStyle={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
            overflow: 'hidden',
          }}
          useForeground
          buttonStyle={{
            backgroundColor:
              this.props.route.params?.type === 'sleep' ? '#6267a8' : 'orange',
            borderRadius: 70,
            marginHorizontal: 20,
            paddingVertical: 18,
            overflow: 'hidden',
          }}
          onPressIn={() => {
            if (params.type == 'sleep') {
              let sess = this.context.reduState.sleepPr;
              let session = sess.filter(t => t.plan !== params.data.name);
              session.push({
                plan: params.data.name,
                lesson: lesson,
                chapter: chapter,
              });
              this.context.dispatch({type: 'sleepSess', payload: [...session]});
            } else {
              let sess = this.context.reduState.session;
              let session = sess.filter(t => t.plan !== params.data.name);
              if (session.length == 3) {
                session.pop();
                session.push({
                  plan: params.data.name,
                  lesson: lesson,
                  chapter: chapter,
                });
              } else {
                session.push({
                  plan: params.data.name,
                  lesson: lesson,
                  chapter: chapter,
                });
                session.reverse();
              }

              this.context.dispatch({type: 'session', payload: [...session]});
            }
          }}
          onPressOut={() => {
            this.context.playVideo(params.type, 1);
          }}
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
    marginBottom: 30,
  },
});
