import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableNativeFeedback,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {SearchBar, Button, Icon} from 'react-native-elements';
import {SimpleList} from '../comp/SimpleList';
import {ContextStates} from '../func/ContextStates';
import R from '../res/R';
import Gradient from 'react-native-linear-gradient';
import PremiumTag from '../comp/PremiumTag';
import { checkPurchased } from '../comp/PremiumCheckFun';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Explore extends React.PureComponent {
  static contextType = ContextStates;
  state = {
    search: '',
    selected: false,
    data: this.context.reduState.explore,
    purchasedPremium:false
  };
  componentDidMount = async() => {
const purchasedPremium=await checkPurchased()
this.setState({purchasedPremium})
  };
  updateSearch = search => {
    const data =
      search == ''
        ? this.context.reduState.explore
        : this.context.reduState.explore.filter(
            t => t.name.toLowerCase().search(search.toLowerCase()) > -1,
          );
    this.setState({search, data});
  };
  render() {
    const {search, selected} = this.state;

    return (
      // <ContextStates.Consumer>
      //   {() => {
      //     return (
      <View style={{backgroundColor: '#fff', flex: 1}}>
        <View style={{backgroundColor: '#fff', elevation: 10}}>
          <SearchBar
            lightTheme={true}
            onFocus={() => this.setState({selected: true})}
            onBlur={() => this.setState({selected: false})}
            searchIcon={() => (
              
              // <Button
              //   activeOpacity={0}
              //   onPress={() => this.setState({selected: false})}
                // disabled
                <Icon
                  name=
                    // selected ? 'keyboard-backspace' :
                    'search'
                  color= 'grey'
                  size={hp(2.6)}
                
              //   containerStyle={{
              //     margin: 0,
              //     padding: 0,
              //     marginLeft: -20,
              //     padding: 0,
              //   }}
              //   buttonStyle={{
              //     backgroundColor: 'rgba(0,0,0,0)',
              //   }}
              />
            )}
            containerStyle={{
              backgroundColor: '#fff',
              paddingTop: hp(5.1),
              padding: hp(2.6),
              // paddingBottom: !selected ? 60 : 20,
            }}
            inputContainerStyle={{
              backgroundColor: '#f0f0f0',
              borderRadius: hp(5.1),
              paddingHorizontal: wp(5.6),
            }}
            placeholder="Search courses"
            onChangeText={this.updateSearch}
            // onClear={this.updateSearch}
            value={search}
          />
          {/* <ScrollView
            horizontal
            style={{
              position: 'absolute',
              bottom: 0,
              paddingVertical: 10,
            }}
            contentContainerStyle={{paddingHorizontal: 30}}
            showsHorizontalScrollIndicator={false}>
            {!selected &&
              // <FlatList
              // data={
              [
                'focus',
                'walk',
                'relax',
                'anger',
                'morning',
                'happy',
                'sleep',
              ].map((item, index) => (
                <TouchableNativeFeedback
                  key={index}
                  onPress={() => this.setState({search: item, selected: true})}
                  useForeground>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 20,
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderWidth: 0.2,
                      borderColor: 'grey',
                      marginRight: 10,
                      overflow: 'hidden',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 13,
                        color: 'grey',
                      }}>
                      {item}
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              ))}
          </ScrollView>
        */}
        </View>
          <FlatList
            data={this.state.data}
            contentContainerStyle={{
              padding: !selected ? hp(2.6) : hp(2.6),
            }}
            keyExtractor={(itm, index) => index.toString()}
            renderItem={({item, index}) => (
              <View
                style={{
                  backgroundColor: 'grey',
                  borderRadius: hp(1.3),
                  width: '100%',
                  marginBottom: hp(2.6),
                  overflow: 'hidden',
                }}>
                <TouchableNativeFeedback
                  onPress={() => {
                    // if (this.state.selected) this.updateSearch(item);
                    // else
                    this.props.navigation.navigate('Plan', {
                      data: item,type:'explore'
                    });
                  }}
                  useForeground={true}>
                  {/* {!selected ? ( */}
                  <View style={{}}>
                    <ImageBackground
                      source={{uri:this.context.reduState.imgExplore[item.coverImage]}}
                      style={{
                        width: '100%',
                        backgroundColor: R.colors.img,
                      }}>
                      <View
                        style={{
                          padding: hp(3.9),paddingVertical:hp(5.1),
                          width: '100%',
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: hp(2.1),
                            color: '#000',
                          }}>
                          {item.name}
                        </Text>
                      </View>
                      
                 {!this.state.purchasedPremium&&item.premium&& 
                  <>
                  <Gradient
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: 0}}
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                  style={{width:'100%',height:'100%',position:'absolute'}}
                />
                <PremiumTag /></>}
                    </ImageBackground>
                  </View>
                  {/* ) : (
                    <View style={{paddingBottom: 10, width: '100%'}}>
                      <SimpleList title={'title'} image={''} />
                    </View>
                  )} */}
                </TouchableNativeFeedback>
              </View>
            )}
          />
        
      </View>
      //     );
      //   }}
      // </ContextStates.Consumer>
    );
  }
}
