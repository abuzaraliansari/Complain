import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import apiService from '../apiService';
import AppStyles from '../AppStyles';

const SignupForm = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [mobileno, setMobileno] = useState('');
  const [password, setPassword] = useState('');
  const [emailID, setEmailID] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const emailRegex = /^[^\s@]+@gmail\.com$/;
  const mobileRegex = /^\d{10}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;

  const checkMobileNumber = async (mobileNumber) => {
    try {
      const response = await apiService.checkMobileNumber(mobileNumber);
      return response.exists;
    } catch (error) {
      console.error('Error checking mobile number:', error);
      Alert.alert('Error', 'Failed to check mobile number. Please try again.');
      return false;
    }
  };

  const handleMobileNumberChange = (number) => {
    setMobileno(number);
    if (number.length === 10) {
      checkMobileNumber(number);
    }
  };

  const handleSignup = async () => {
    if (emailID.trim() !== '' && !emailRegex.test(emailID)) {
      Alert.alert('Error', 'Invalid email format. Email must end with gmail.com.');
      return;
    }

    if (!mobileRegex.test(mobileno)) {
      Alert.alert('Invalid Mobile number', 'It must be 10 digits.');
      return;
    }

    if (!passwordRegex.test(password)) {
      Alert.alert('Invalid Password', 'Password must be 8 to 12 characters long and contain a mix of alphabets and numbers.');
      return;
    }

    const mobileExists = await checkMobileNumber(mobileno);
    if (mobileExists) {
      Alert.alert('Error', 'This mobile number is already present. Please change the number.');
      return;
    }

    try {
      const data = { username, mobileno, password, emailID, isAdmin };
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
        onChangeText={handleMobileNumberChange}
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
      <CheckBox
        title="Is Admin"
        checked={isAdmin}
        onPress={() => setIsAdmin(!isAdmin)}
        containerStyle={AppStyles.checkboxContainer}
        textStyle={AppStyles.label}
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