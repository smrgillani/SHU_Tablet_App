import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
// import images from '../constants/images';
import fontFamily from '../constants/fontFamily';

const TopHeader = props => {
  const {subText} = props;
  return (
    <View style={styles.mainContainer}>
      {/*<Image source={images.topHeaderLogo} />*/}
      <Text style={styles.appName}>Smart Home Utility</Text>
      <Text style={styles.subText}>{subText}</Text>
    </View>
  );
};
export default TopHeader;
const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 70,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontFamily: fontFamily.Nunito_Bold,
    marginBottom: 20,
    marginTop: 20,
    fontSize: 30,
    color: '#A884FF',
  },
  subText: {
    fontSize: 16,
    fontFamily: fontFamily.Nunito_Regular,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFF',
  },
});