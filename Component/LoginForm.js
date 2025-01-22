import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import apiService from '../apiService';
import { AuthContext } from '../Contexts/AuthContext';
import AppStyles from '../AppStyles';

const LoginForm = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthToken } = useContext(AuthContext);
  

  const handleLogin = async () => {
    try {
      const data = { username, password };
      const response = await apiService.login(data);
      setAuthToken(response.token);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
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