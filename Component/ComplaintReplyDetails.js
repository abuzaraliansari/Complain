import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import apiService from '../apiService';
import AppStyles from '../AppStyles';
import { AuthContext } from '../Contexts/AuthContext';

const ComplaintReplyDetails = () => {
  const [replies, setReplies] = useState([]);
  const [replyDescription, setReplyDescription] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [complaintNo, setComplaintNo] = useState('');
  const { categoryID, userDetails } = useContext(AuthContext);
  const isAdmin = userDetails?.isAdmin;

  const fetchReplies = async () => {
    try {
      const response = await apiService.getComplaintReplies({ Complaintno: categoryID || complaintNo });
      setReplies(response);
    } catch (error) {
      console.error('Error fetching replies:', error);
      Alert.alert('Error', 'Failed to fetch replies');
    }
  };

  useEffect(() => {
    if (categoryID || complaintNo) {
      fetchReplies();
    }
  }, [categoryID, complaintNo]);

  const fetchIpAddress = async () => {
    try {
      console.log('Fetching IP address...');
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      console.log('IP address fetched:', data.ip);
      setIpAddress(data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };

  const handleAddReply = async (isAdminReply) => {
    await fetchIpAddress();
    console.log('Adding reply with IP address:', ipAddress);
    const data = {
      Complaintno: categoryID || complaintNo,
      ReplyDescription: isAdminReply ? 'Admin: ' + replyDescription : 'Customer: ' + replyDescription,
      IPAddress: ipAddress,
      IsAdminReply: isAdminReply,
    };

    console.log('Data to be submitted:', data);

    try {
      const response = await apiService.submitComplaintReply(data);
      console.log('Server response:', response);
      Alert.alert('Success', 'Reply submitted successfully');
      setReplyDescription(''); // Clear input
      fetchReplies(); // Refresh replies
    } catch (error) {
      console.error('Error submitting reply:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to submit reply');
    }
  };

  return (
    <View style={AppStyles.container}>
      <ScrollView style={styles.chatContainer}>
        {replies.length === 0 ? (
          <Text style={AppStyles.displayNoDataText}>No replies found</Text>
        ) : (
          replies.map((reply, index) => (
            <View key={index} style={[styles.chatBubble, reply.IsAdminReply ? styles.adminReplyBubble : null]}>
              <Text style={styles.chatText}>{reply.ReplyDescription}</Text>
              <Text style={styles.chatDate}>{new Date(reply.ReplyDate).toLocaleString()}</Text>
              <Text style={styles.chatIp}>{reply.IPAddress}</Text>
            </View>
          ))
        )}
      </ScrollView>
      {isAdmin && (
        <TextInput
          style={styles.input}
          placeholder="Enter Complaint Number"
          value={complaintNo}
          onChangeText={setComplaintNo}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your reply"
          value={replyDescription}
          onChangeText={setReplyDescription}
        />
        <TouchableOpacity
          style={[styles.sendButton, isAdmin === 1 ? null : styles.disabledButton]}
          onPress={() => handleAddReply(1)}
          disabled={isAdmin !== 1}
        >
          <Text style={styles.sendButtonText}>Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendButton, isAdmin === 0 ? null : styles.disabledButton]}
          onPress={() => handleAddReply(0)}
          disabled={isAdmin !== 0}
        >
          <Text style={styles.sendButtonText}>Customer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatBubble: {
    backgroundColor: '#e1ffc7',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'flex-start',
  },
  adminReplyBubble: {
    backgroundColor: '#ffcccb', // Different color for admin replies
  },
  chatText: {
    fontSize: 16,
  },
  chatDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  chatIp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    //paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5, // Add margin between buttons
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ComplaintReplyDetails;
