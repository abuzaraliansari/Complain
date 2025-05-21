import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const OtpVerificationScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');
  const { userDetails } = route.params; // Get userDetails from the previous screen
  const { mobileNumber } = userDetails; // Extract mobileNumber from userDetails

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'OTP must be exactly 6 digits');
      return;
    }

    try {
      const response = await axios.post('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net:3000/auth/verifyOtp', {
        mobileNumber,
        otp,
      });

      if (response.data.success) {
        Alert.alert('Success', 'OTP verified successfully');
        navigation.replace('Home', { userDetails }); // Navigate to the Home screen with userDetails
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      Alert.alert('Error', 'Failed to verify OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the 6-digit OTP sent to {mobileNumber}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        maxLength={6} // Restrict input to 6 digits
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OtpVerificationScreen;