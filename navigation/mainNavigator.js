import React, {Fragment, useEffect} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/welcomeScreen';
import SignIn from '../screens/user/signInScreen';
import SignUp from '../screens/user/signUpScreen';
import Dashboard from '../screens/user/dashboardScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = ({navigation}) => {
  return (
    <Stack.Navigator>
      <Fragment>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="SignIn" component={SignIn} options={{headerShown: false}} />
        <Stack.Screen name="SignUp" component={SignUp} options={{headerShown: false}} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{
          headerStyle: {
            backgroundColor: '#131524',
            borderColor: '#000',
            borderBottomWidth: 0,
            shadowColor: '#040509',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackVisible:false
        }} />
      </Fragment>
    </Stack.Navigator>
  );
};

export default MainNavigator;