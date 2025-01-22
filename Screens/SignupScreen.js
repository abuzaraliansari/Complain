import React from 'react';
import { View } from 'react-native';
import SignupForm from '../Component/SignupForm';

const SignupScreen = ({ navigation }) => {
  return (
    <View>
      <SignupForm navigation={navigation} />
    </View>
  );
};

export default SignupScreen;