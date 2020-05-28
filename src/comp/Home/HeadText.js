import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const HeadText = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.head}>{props.title}</Text>
      {props.caption && <Text style={styles.subHead}>{props.caption}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
  },
  head: {
    color: '#5e5a61',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subHead: {
    color: 'darkgrey',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});
