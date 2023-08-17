import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import TopHeader from '../components/topHeader';
import images from '../constants/images';
import fontFamily from '../constants/fontFamily';

const WelcomeScreen = ({navigation}) => {
  return (
    <ScrollView style={styles.scContainer}>
      <View style={styles.mainContainer}>
        <TopHeader />
        <View style={styles.middleImg}>
          <Image style={{ resizeMode: "stretch", height: 304, width: 350 }} source={images.wsImage} />
        </View>
        <View style={styles.bottomView}>
          <Text style={{ marginBottom: 20, fontFamily: fontFamily.Nunito_Regular, fontSize: 16, color: '#fff' }}>
            Control every signle utility of your home
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={styles.commonBtn}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={[styles.commonBtn, styles.signUpBtnBg]}>
            <Text style={styles.signUpText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
export default WelcomeScreen;
const styles = StyleSheet.create({
  scContainer: {
    backgroundColor: '#151833'
  },
  mainContainer: {
    flex: 1,
    paddingLeft: 45,
    paddingRight: 45,
  },
  middleImg: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiTouch: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 50,
  },
  bottomView: {
    display: 'flex',
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  commonBtn: {
    elevation: 5,
    height: 50,
    backgroundColor: '#34B6FF',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginText: {
    fontFamily: fontFamily.Nunito_Bold,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 4,
    color: '#FFFFFF',
  },
  signUpText: {
    fontFamily: fontFamily.Nunito_Regular,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 4,
    color: '#FFFFFF',
  },
  signUpBtnBg: {
    backgroundColor: '#0C8A9B'
  },
});