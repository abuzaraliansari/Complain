import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import apiService from '../apiService';
import { AuthContext } from '../Contexts/AuthContext';
import AppStyles from '../AppStyles';

const LoginForm = ({ navigation }) => {
  const [identifier, setIdentifier] = useState(''); // This will hold either username or mobile number
  const [password, setPassword] = useState('');
  const { setAuthToken, setUserDetails, userDetails } = useContext(AuthContext);
  // OTP-related states
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [error, setError] = useState('');

  // Handle login (Get OTP)
  const handleLogin = async () => {
    setError('');
    setOtpError('');
    setOtpSuccess('');
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
        // OTP flow: show OTP input, start timer, disable fields
        setShowOtp(true);
        setResendTimer(60);
        setCanResend(false);
        setFieldsDisabled(true);
        // Optionally, store user data for OTP verification if needed
        setUserDetails(response.user);
        setAuthToken(response.token); // You may want to set this only after OTP success in real API
      } else {
        setError(response.message || 'Invalid username or password');
        setShowOtp(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to login');
      setShowOtp(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (value) => {
    setOtp(value);
    setOtpError('');
    setOtpSuccess('');
  };

  // Handle OTP submit
  const handleOtpSubmit = async () => {
    setOtpError('');
    setOtpSuccess('');
    if (otp.length !== 6) {
      setOtpError('OTP must be exactly 6 digits');
      return;
    }
    // Simulate OTP API call (replace with real API if needed)
    if (otp === '444444') {
      setOtpSuccess('OTP is correct!');
      setOtpError('');
      setTimeout(() => {
        navigation.replace('Home', { userDetails });
      }, 800);
    } else {
      setOtpError('Invalid or expired OTP');
      setOtpSuccess('');
    }
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    if (canResend) {
      setOtp('');
      setOtpError('');
      setOtpSuccess('');
      setResendTimer(60);
      setCanResend(false);
      setFieldsDisabled(true);
      // Optionally, call resend OTP API here
    }
  };

  // Resend timer effect
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendTimer === 0 && showOtp) {
      setCanResend(true);
      setFieldsDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, showOtp]);

  return (
    <View style={AppStyles.loginContainer}>
      <Text style={AppStyles.loginTitle}>Login</Text>
      {!showOtp ? (
        <>
         
          <TextInput
            style={AppStyles.loginInput}
            placeholder="Username or Mobile Number"
            value={identifier}
            onChangeText={setIdentifier}
            editable={!fieldsDisabled}
          />
          <TextInput
            style={AppStyles.loginInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!fieldsDisabled}
          />
          <TouchableOpacity style={AppStyles.loginButton} onPress={handleLogin} disabled={fieldsDisabled}>
            <Text style={AppStyles.loginButtonText}>Get OTP</Text>
          </TouchableOpacity>
          {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
        </>
      ) : (
        <>
          <TextInput
            style={AppStyles.loginInput}
            placeholder="Enter OTP (444444)"
            value={otp}
            onChangeText={handleOtpChange}
            maxLength={6}
            keyboardType="numeric"
          />
          <TouchableOpacity style={AppStyles.loginButton} onPress={handleOtpSubmit}>
            <Text style={AppStyles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          {otpError ? <Text style={{ color: 'red', marginTop: 8 }}>{otpError}</Text> : null}
          {otpSuccess ? <Text style={{ color: 'green', marginTop: 8 }}>{otpSuccess}</Text> : null}
          <TouchableOpacity
            style={{
              backgroundColor: canResend ? '#4caf50' : '#ccc',
              marginTop: 16,
              padding: 10,
              borderRadius: 4,
              alignItems: 'center',
            }}
            onPress={handleResendOtp}
            disabled={!canResend}
          >
            <Text style={{ color: '#fff' }}>{canResend ? 'Resend OTP' : `Resend OTP (${resendTimer}s)`}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default LoginForm;