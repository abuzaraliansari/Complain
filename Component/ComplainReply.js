import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import apiService from '../apiService';
import AppStyles from '../AppStyles';
import { AuthContext } from '../Contexts/AuthContext';

const ComplaintReplyDetails = ({ route, navigation }) => {
  const { complaintno } = route.params;
  const [replies, setReplies] = useState([]);
  const [replyDescription, setReplyDescription] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const { userDetails } = useContext(AuthContext);

  const fetchReplies = async () => {
    try {
      const response = await apiService.getComplaintReplies({ complaintno });
      setReplies(response);
    } catch (error) {
      console.error('Error fetching replies:', error);
      Alert.alert('Error', 'Failed to fetch replies');
    }
  };

  const fetchIpAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIpAddress(data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyDescription.trim()) {
      Alert.alert('Error', 'Reply description cannot be empty');
      return;
    }

    try {
      await apiService.submitComplaintReply({
        complaintno,
        replyDescription,
        isAdmin: userDetails.isAdmin,
        ipAddress,
      });
      setReplyDescription('');
      fetchReplies();
    } catch (error) {
      console.error('Error submitting reply:', error);
      Alert.alert('Error', 'Failed to submit reply');
    }
  };

  useEffect(() => {
    fetchReplies();
    fetchIpAddress();
  }, []);

  return (
    <View style={AppStyles.container}>
      <ScrollView style={AppStyles.scrollView}>
        {replies.map((reply, index) => (
          <View key={index} style={reply.IsAdmin ? AppStyles.adminReply : AppStyles.userReply}>
            <Text style={AppStyles.replyText}>{reply.ReplyDescription}</Text>
            <Text style={AppStyles.replyDate}>{new Date(reply.ReplyDate).toLocaleString()}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={AppStyles.replyInputContainer}>
        <TextInput
          style={AppStyles.replyInput}
          value={replyDescription}
          onChangeText={setReplyDescription}
          placeholder="Type your reply..."
        />
        <TouchableOpacity style={AppStyles.replyButton} onPress={handleReplySubmit}>
          <Text style={AppStyles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ComplaintReplyDetails;