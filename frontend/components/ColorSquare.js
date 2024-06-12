import React from 'react';
import {View, StyleSheet} from 'react-native';

const ColorSquare = ({colorHex}) => {
  const boxColor = {
    backgroundColor: colorHex,
  };
  return <View style={[styles.box, boxColor]} />;
};

const styles = StyleSheet.create({
  box: {
    width: "3em",
    height: "3em",
    marginRight: 10,
    borderColor: '#dddddd',
    borderWidth: 1,
    borderStyle: 'solid',
  },
});

export default ColorSquare;