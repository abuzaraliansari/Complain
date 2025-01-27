import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import apiService from '../apiService';
import AppStyles from '../AppStyles';

const ComplainReply = ({ route, navigation }) => {
  const { complaint } = route.params;
  const [replyDescription, setReplyDescription] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    fetchIpAddress();
  }, []);

  const fetchIpAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIpAddress(data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };

  const handleReply = async () => {
    const data = {
      Complaintno: complaint.CategoryID,
      ReplySno: complaint.CategoryID, // Assuming ReplySno is the same as Complaintno for simplicity
      ReplyDescription: replyDescription,
      IPAddress: ipAddress,
    };

    try {
      await apiService.submitComplaintReply(data);
      Alert.alert('Success', 'Reply submitted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting reply:', error);
      Alert.alert('Error', 'Failed to submit reply');
    }
  };

  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.title}>Reply to Complaint {complaint.CategoryID}</Text>
      <TextInput
        style={AppStyles.input}
        placeholder="Enter your reply"
        value={replyDescription}
        onChangeText={setReplyDescription}
      />
      <TouchableOpacity style={AppStyles.button} onPress={handleReply}>
        <Text style={AppStyles.buttonText}>Submit Reply</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ComplainReply;