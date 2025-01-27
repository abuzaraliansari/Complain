import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import apiService from '../apiService';
import AppStyles from '../AppStyles';

const SignupForm = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [mobileno, setMobileno] = useState('');
  const [password, setPassword] = useState('');
  const [emailID, setEmailID] = useState('');

  const handleSignup = async () => {
    try {
      const data = { username, mobileno, password, emailID };
      const response = await apiService.signup(data);
      if (response.success) {
        Alert.alert('Success', `User ${username} created successfully`);
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', 'User already exists');
      } else {
        console.error(error);
        Alert.alert('Error', 'Failed to create user');
      }
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
        placeholder="Email ID"
        value={emailID}
        onChangeText={setEmailID}
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
      <TouchableOpacity style={AppStyles.loginButton} onPress={() => navigation.replace('Login')}>
        <Text style={AppStyles.loginButtonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupForm;