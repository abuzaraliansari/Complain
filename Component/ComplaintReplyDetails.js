import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import apiService from '../apiService';
import AppStyles from '../AppStyles';

const ComplaintReplyDetails = () => {
  const [complaintNo, setComplaintNo] = useState('');
  const [replies, setReplies] = useState([]);
  const [replyDescription, setReplyDescription] = useState('');

  const fetchReplies = async () => {
    try {
      const response = await apiService.getComplaintReplies({ Complaintno: complaintNo });
      setReplies(response);
    } catch (error) {
      console.error('Error fetching replies:', error);
      Alert.alert('Error', 'Failed to fetch replies');
    }
  };

  const handleAddReply = async () => {
    const data = {
      Complaintno: complaintNo,
      ReplySno: replies.length + 1, // Incremental ReplySno
      ReplyDescription: replyDescription,
      IPAddress: '', // Fetch IP address if needed
    };

    try {
      await apiService.submitComplaintReply(data);
      Alert.alert('Success', 'Reply submitted successfully');
      fetchReplies(); // Refresh replies
      setReplyDescription(''); // Clear input
    } catch (error) {
      console.error('Error submitting reply:', error);
      Alert.alert('Error', 'Failed to submit reply');
    }
  };

  return (
    <ScrollView style={AppStyles.displayContainer}>
      <View style={AppStyles.displayContent}>
        <Text style={AppStyles.displayHeader}>Enter Complaint Number</Text>
        <TextInput
          style={AppStyles.input}
          placeholder="Enter Complaint Number"
          value={complaintNo}
          onChangeText={setComplaintNo}
        />
        <TouchableOpacity style={AppStyles.button} onPress={fetchReplies}>
          <Text style={AppStyles.buttonText}>Fetch Replies</Text>
        </TouchableOpacity>
        {replies.length === 0 ? (
          <Text style={AppStyles.displayNoDataText}>No replies found</Text>
        ) : (
          replies.map((reply, index) => (
            <View key={index} style={AppStyles.displaySection}>
              <Text style={AppStyles.displaySectionHeader}>Reply {reply.ReplySno}</Text>
              <View style={AppStyles.displayTable}>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>Description</Text>
                  <Text style={AppStyles.displayCell}>{reply.ReplyDescription}</Text>
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>Reply Date</Text>
                  <Text style={AppStyles.displayCell}>{new Date(reply.ReplyDate).toLocaleString()}</Text>
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>IP Address</Text>
                  <Text style={AppStyles.displayCell}>{reply.IPAddress}</Text>
                </View>
              </View>
            </View>
          ))
        )}
        <TextInput
          style={AppStyles.input}
          placeholder="Enter your reply"
          value={replyDescription}
          onChangeText={setReplyDescription}
        />
        <TouchableOpacity style={AppStyles.button} onPress={handleAddReply}>
          <Text style={AppStyles.buttonText}>Add Reply</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ComplaintReplyDetails;