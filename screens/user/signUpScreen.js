import React, {useState} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopHeader from '../../components/topHeader';
import fontFamily from '../../constants/fontFamily';
// import LinearGradient from 'react-native-linear-gradient';
import Hook from '../../hooks';
import images from '../../constants/images';
import { postData } from '../../service/httpService';
import * as Constant from '../../service/constantVars';

const SignIn = ({navigation}) => {
  const [kbHeight] = Hook.useKeyboard();

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const storeUserSession = async (tokenVal, userIdVal) => {

    try {
      await AsyncStorage.setItem('@shu_user_session', JSON.stringify({ token : tokenVal, user_id : userIdVal }));
    } catch (e) {

    }
  }

  const retrieveUserSession = async () => {
    try {

      const value = await AsyncStorage.getItem('@shu_user_session');
      
      if(value !== null) {
        return value;
      }

    } catch(e) {

    }
  }

  const signUp = async () => {

    if(userEmail === ''){
      Alert.alert("Error", "Please enter your email address.");
    }
    else if(userPassword === ''){
      Alert.alert("Error", "Please enter your password.");
    }
    else if(confirmPassword === ''){
      Alert.alert("Error", "Please confirm your password.");
    }
    else if(userPassword != confirmPassword){
      Alert.alert("Error", "Your password didn't match, please enter your password again.");
    }else{

      const payload = {
        userName: userEmail,
        password: userPassword
      }

      postData(`${Constant.ApiMethods.signUp}`, false, payload).then( async (response) => {
          if (response !== undefined) {
            
            if(response.token !== undefined){
              await storeUserSession(response.token,0);

              var rus = await retrieveUserSession();
              rus = rus != null ? JSON.parse(rus) : null;

              if (rus.token.length > 0) {
                  navigation.navigate('ToDashboard');
              } else {
                Alert.alert("Error", "Unable to create User.");
              }
            }else{
              Alert.alert("Error", "Unable to create User.");
            }
          } else {
              Alert.alert("Error", "Unable to create User.");
          }
      })

    }
  }
  return (
    <ScrollView style={{backgroundColor: '#151833'}}>
      <View style={styles.mainContainer}>
        {kbHeight === 0 && (
          <TopHeader subText={'Thank you for choosing us !'} />
        )}

        <View style={styles.middleImg}>
          <Image style={{ resizeMode: "stretch", height: 150, width: 200 }} source={images.signupImage} />
        </View>

        <View style={[styles.formView, {marginTop: kbHeight ? 80 : 0}]}>
          {/*<TextInput style={[styles.input]} placeholder="Full Name" />*/}
          <TextInput style={[styles.input]} onChangeText={(text) => setUserEmail(text)} placeholder="Email" />
          <TextInput style={[styles.input]} secureTextEntry={true} onChangeText={(text) => setUserPassword(text)} placeholder="Password" />
          <TextInput style={[styles.input]} secureTextEntry={true} onChangeText={(text) => setConfirmPassword(text)} placeholder="Confirm Password" />
          <Text style={styles.signInText}>Do you have an account? <Text onPress={() => navigation.navigate('SignIn')} style={styles.signInSubText}>Login</Text></Text>
          <View>
              <TouchableOpacity onPress={() => signUp()} style={styles.commonBtn}>
                <Text style={styles.loginText}>SIGN UP</Text>
              </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </ScrollView>
  );
};
export default SignIn;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#151833',
    paddingLeft: 45,
    paddingRight: 45,
  },
  middleImg: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: fontFamily.Nunito_Regular,
    fontSize: 16,
    height: 50,
  },
  forgotText: {
    fontFamily: fontFamily.Nunito_Bold,
    fontSize: 16,
    color: '#FFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  signInText: {
    fontFamily: fontFamily.Nunito_Bold,
    fontSize: 16,
    color: '#FFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  signInSubText: {
    fontWeight: 'bold',
    color: '#34FFDA',
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
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signUpText: {
    fontFamily: fontFamily.Nunito_Regular,
    fontSize: 16,
    letterSpacing: 4,
    color: '#fff',
  },
  bottomView: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontFamily: fontFamily.Nunito_Bold,
    fontSize: 16,
    letterSpacing: 4,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 0,
  },
});