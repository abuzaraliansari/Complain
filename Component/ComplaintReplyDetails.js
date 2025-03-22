import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker';
import apiService from '../apiService';
import AppStyles from '../AppStyles';
import { AuthContext } from '../Contexts/AuthContext';

const ComplaintReplyDetails = ({ route, navigation }) => {
  const { complaintno, attachmentDoc } = route.params;
  const [replies, setReplies] = useState([]);
  const [replyDescription, setReplyDescription] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const { userDetails } = useContext(AuthContext);

  const fetchReplies = async () => {
    try {
      const response = await apiService.getComplaintReplies({ complaintno });
      setReplies(response);
      console.log('Fetched replies:', response);
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
        isAdmin: userDetails.roles.includes('Admin'),
        ipAddress,
        attachment: attachmentDoc,
        imageUrl: uploadedImage ? uploadedImage.uri : null,
        userDetails,
      });
      setReplyDescription('');
      setUploadedImage(null);
      fetchReplies();
    } catch (error) {
      console.error('Error submitting reply:', error);
      Alert.alert('Error', 'Failed to submit reply');
    }
  };

  const handleCloseComplaint = async () => {
    try {
      console.log('Closing complaint:', complaintno);
      await apiService.updateComplaintStatus({
        complaintno,
        status: 'Closed',
        modifiedBy: userDetails.username,
      });
      Alert.alert('Success', 'Complaint closed successfully');
      navigation.replace('ComplaintStatus', {
        CreatedDate: complaint.CreatedDate,
        ComplaintID: complaint.ComplaintID,
        source: 'Home',
      });
    } catch (error) {
      console.error('Error closing complaint:', error);
      Alert.alert('Error', 'Failed to close complaint');
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
            <Text style={AppStyles.replyDate}>
              <Text style={AppStyles.replyBy}>By: {reply.ReplyBy}</Text> | {new Date(reply.ReplyDate).toLocaleString()}
            </Text>
            {reply.ImageUrl && (
              <Image source={{ uri: reply.ImageUrl }} style={AppStyles.imagePreview} />
            )}
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
      {uploadedImage && (
        <Image source={{ uri: uploadedImage.uri }} style={AppStyles.imagePreview} />
      )}
      <TouchableOpacity style={AppStyles.closeButton} onPress={handleCloseComplaint}>
        <Text style={AppStyles.closeButtonText}>Close Complaint</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ComplaintReplyDetails;