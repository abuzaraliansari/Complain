import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import apiService from '../apiService';
import AppStyles from '../AppStyles';

const SignupForm = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [mobileno, setMobileno] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const data = { username, mobileno, password };
      await apiService.signup(data);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={AppStyles.loginContainer}>
      <Text style={AppStyles.loginTitle}>Signup</Text>
      <TextInput
        style={AppStyles.loginInput}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={AppStyles.loginInput}
        placeholder="Mobile No"
        value={mobileno}
        onChangeText={setMobileno}
      />
      <TextInput
        style={AppStyles.loginInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={AppStyles.loginButton} onPress={handleSignup}>
        <Text style={AppStyles.loginButtonText}>Signup</Text>
      </TouchableOpacity>
      <TouchableOpacity style={AppStyles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={AppStyles.loginButtonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupForm;