import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import apiService from '../apiService';
import { AuthContext } from '../Contexts/AuthContext';
import AppStyles from '../AppStyles';

const LoginForm = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthToken, setUserDetails } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const data = { username, password };
      console.log('Sending login request with data:', data); 
      const response = await apiService.login(data);
      console.log('Received response:', response);
      console.log('data', data);
      if (response.success) {
        console.log('response', response);
        setAuthToken(response.token);
        setUserDetails({
          username: response.user.username,
          mobileno: response.user.mobileno,
          emailID: response.user.emailID,
          isAdmin: response.user.isAdmin
        });
        console.log(response);
        console.log(username);
        console.log(password);
        console.log(response.token);
        console.log(response.user.username);
        console.log(response.user.mobileno);
        console.log(response.user.emailID);
        console.log(response.user.isAdmin);
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to login');
    }
  };

  return (
    <View style={AppStyles.loginContainer}>
      <Text style={AppStyles.loginTitle}>Login</Text>
      <TextInput
        style={AppStyles.loginInput}
        placeholder="Username or Mobile No"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={AppStyles.loginInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={AppStyles.loginButton} onPress={handleLogin}>
        <Text style={AppStyles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={AppStyles.loginButton} onPress={() => navigation.navigate('Signup')}>
        <Text style={AppStyles.loginButtonText}>Go to Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;