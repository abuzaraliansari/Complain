import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './Contexts/AuthContext';
import { FormDataProvider } from './Contexts/FormDataContext';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import HomeScreen from './Screens/HomeScreen';
import FormScreen from './Screens/FormScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <FormDataProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Form" component={FormScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FormDataProvider>
    </AuthProvider>
  );
};

export default App;