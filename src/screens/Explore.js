import React from 'react';
import {View, Text, FlatList, TouchableNativeFeedback} from 'react-native';
import {SearchBar, Button} from 'react-native-elements';
import {SimpleList} from '../comp/SimpleList';
import {ContextStates} from '../func/ContextStates';

export default class Explore extends React.PureComponent {
  state = {
    search: '',
    selected: false,
    data: [
      'Weathering the storm',
      'Reframe stress',
      'Anger, sadness and growth',
      'begining meditation',
    ],
  };
  componentDidMount = () => {};
  updateSearch = search => {
    this.setState({search});
  };
  render() {
    const {search, selected} = this.state;

    return (
      <ContextStates.Consumer>
        {({loader}) => {
          if (loader)
            return <View style={{flex: 1, backgroundColor: '#000'}} />;

          return (
            <View style={{flex: 1}}>
              <View style={{backgroundColor: '#fff', elevation: 10}}>
                <SearchBar
                  lightTheme={true}
                  onFocus={() => this.setState({selected: true})}
                  onBlur={() => this.setState({selected: false})}
                  searchIcon={() => (
                    <Button
                      activeOpacity={0}
                      onPress={() => this.setState({selected: false})}
                      icon={{
                        name: selected ? 'keyboard-backspace' : 'search',
                        color: 'grey',
                        size: 20,
                      }}
                      containerStyle={{
                        margin: 0,
                        padding: 0,
                        marginLeft: -20,
                        padding: 0,
                      }}
                      buttonStyle={{
                        backgroundColor: 'rgba(0,0,0,0)',
                      }}
                    />
                  )}
                  containerStyle={{
                    backgroundColor: '#fff',
                    paddingTop: 40,
                    padding: 20,
                    paddingBottom: !selected ? 60 : 20,
                  }}
                  inputContainerStyle={{
                    backgroundColor: '#f0f0f0',
                    borderRadius: 40,
                    paddingHorizontal: 20,
                  }}
                  placeholder="Search courses"
                  onChangeText={this.updateSearch}
                  value={search}
                />
                {!selected && (
                  <FlatList
                    data={[
                      'focus',
                      'walk',
                      'relax',
                      'anger',
                      'morning',
                      'happy',
                      'sleep',
                    ]}
                    style={{position: 'absolute', bottom: 0}}
                    contentContainerStyle={{
                      paddingHorizontal: 20,
                      flexDirection: 'row',
                      paddingVertical: 10,
                    }}
                    keyExtractor={(itm, index) => {
                      index.toString();
                    }}
                    renderItem={({item, index}) => (
                      <TouchableNativeFeedback
                        onPress={() =>
                          this.setState({search: item, selected: true})
                        }>
                        <View
                          key={index}
                          style={{
                            backgroundColor: '#fff',
                            borderRadius: 20,
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderWidth: 0.2,
                            borderColor: 'grey',
                            marginRight: 10,
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
                    )}
                  />
                )}
              </View>
              <View style={{height: '100%'}}>
                <FlatList
                  data={this.state.data}
                  contentContainerStyle={{
                    padding: !selected ? 20 : 0,
                  }}
                  keyExtractor={(itm, index) => {
                    index.toString();
                  }}
                  renderItem={({item, index}) => (
                    <TouchableNativeFeedback
                      key={index}
                      onPress={() =>
                        selected
                          ? this.updateSearch(item)
                          : this.props.navigation.navigate('ExploreList')
                      }
                      style={{borderRadius: 10}}>
                      {!selected ? (
                        <View
                          style={{
                            backgroundColor: 'grey',
                            borderRadius: 10,
                            padding: 30,
                            width: '100%',
                            marginBottom: 20,
                          }}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: 16,
                              color: '#fff',
                            }}>
                            {item}
                          </Text>
                        </View>
                      ) : (
                        <View style={{paddingBottom: 10, width: '100%'}}>
                          <SimpleList />
                        </View>
                      )}
                    </TouchableNativeFeedback>
                  )}
                />
              </View>
            </View>
          );
        }}
      </ContextStates.Consumer>
    );
  }
}
