import React from 'react';
import {
  View,
  Dimensions,
  Animated,
  ImageBackground,
  StatusBar,
} from 'react-native';

let {width: W, height: H} = Dimensions.get('window');
//number Of fireflies
let flies = 10;

function random() {
  const randomNum = 1000 + Math.random() * 1000;
  return Math.round(randomNum / 100) * 100;
}
function randomB() {
  const randomNum = 500 + Math.random() * 500;
  return Math.round(randomNum / 10) * 10;
}

export default class Fireflies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fly: [],
      blink: [],
    };
  }

  _loopAnimation(i) {
    let des = {x: W * Math.random(), y: Math.random() * 200};
    clearInterval(this['fly' + i]);
    this['fly' + i] = setInterval(() => {
      let blink = this.state.blink;
      blink[i] = !blink[i];
      this.setState({blink});
    }, randomB());
    Animated.timing(this.state.fly[i], {
      toValue: des,
      duration: random() * 4,
      useNativeDriver: true,
    }).start(() => {
      this._loopAnimation(i);
    });
  }

  componentDidMount() {
    let fly = [];
    let blink = [];
    for (let i = 0; i < flies; i++) {
      fly.push(new Animated.ValueXY({x: randomB(), y: randomB()}));
      blink.push(true);
    }
    this.setState({fly, blink}, () => {
      for (let i = 0; i < flies; i++) this._loopAnimation(i);
    });
  }

  componentWillUnmount() {
    for (let i = 0; i < flies; i++) clearInterval(this['fly' + i]);
  }

  render() {
    return (
      <ImageBackground
        style={{
          height: 300,
          width: W,
        }}
        source={require('../res/imgs/mpv.jpg')}>
        {this.state.fly.map((itm, i) => (
          <Animated.View
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: 25,
              backgroundColor: 'rgb(207,255,4)',
              position: 'absolute',
              translateX: this.state.fly[i].x,
              translateY: this.state.fly[i].y,
              opacity: this.state.blink[i] ? 1 : 0.2,
              borderWidth: 2,
              borderColor: 'rgba(207,255,4,0.2)',
            }}
          />
        ))}
        {this.props.children}
      </ImageBackground>
    );
  }
}
