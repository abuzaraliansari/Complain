import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import apiService from '../apiService';
import { AuthContext } from '../Contexts/AuthContext';
import AppStyles from '../AppStyles';

const LoginForm = ({ navigation }) => {
  const [identifier, setIdentifier] = useState(''); // This will hold either username or mobile number
  const [password, setPassword] = useState('');
  const { setAuthToken, setUserDetails } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const data = { password };
      if (isNaN(identifier)) {
        data.username = identifier;
      } else {
        data.mobileNumber = identifier;
      }
      console.log('Sending login request with data:', data);
      const response = await apiService.loginc(data);
      console.log('Received response:', response);

      if (response.success) {
        const isActive = response.user.isActive; // Use isActive as a boolean
        console.log('isActive as boolean:', isActive);

        if (!isActive) {
          Alert.alert('Inactive User', 'Your account is inactive. Please activate it before logging in.');
          return; // Prevent navigation if the user is inactive
        }

        setAuthToken(response.token);
        const userDetails = {
          userID: response.user.userID,
          username: response.user.username,
          mobileNumber: response.user.mobileNumber,
          emailID: response.user.emailID,
          roles: response.user.roles,
          isActive, // Store isActive as a boolean
          zoneID: response.user.zoneID,
          locality: response.user.locality,
          colony: response.user.colony,
          galliNumber: response.user.galliNumber,
          houseNumber: response.user.houseNumber,
          geoLocation: response.user.geoLocation,
          createdBy: response.user.createdBy,
          createdDate: response.user.createdDate,
          modifiedBy: response.user.modifiedBy,
          modifiedDate: response.user.modifiedDate,
          firstName: response.user.firstName,
          adharNumber: response.user.adharNumber,
          colonyName: response.user.colonyName,
          localityName: response.user.localityName,
          zoneName: response.user.zoneName,
        };
        setUserDetails(userDetails);

        // Call the sendOtp API
        const otpResponse = await axios.post('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net:3000/auth/sendSms', {
          mobileNumber: response.user.mobileNumber,
        });

        if (otpResponse.data.success) {
          Alert.alert('Success', 'OTP sent successfully');
          navigation.replace('SendSms', { userDetails }); // Navigate to SendSms with userDetails
        } else {
          Alert.alert('Error', otpResponse.data.message);
        }
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Failed to login');
    }
  };

  return (
    <View style={AppStyles.loginContainer}>
      <Text style={AppStyles.loginTitle}>Login</Text>
      <TextInput
        style={AppStyles.loginInput}
        placeholder="Username or Mobile Number"
        value={identifier}
        onChangeText={setIdentifier}
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
    </View>
  );
};

export default LoginForm;