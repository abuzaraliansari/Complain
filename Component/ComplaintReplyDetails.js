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

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      if (result) {
        const { name: documentName, uri: documentUri } = result;
        setUploadedImage({ documentName, documentUri });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'Document selection was cancelled.');
      } else {
        Alert.alert('Error', 'Document selection failed.');
      }
    }
  };

  const handleTakePhoto = async () => {
    launchCamera(
      { mediaType: 'photo', saveToPhotos: true },
      async (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.log('Camera error:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const { uri, fileName } = response.assets[0];
          console.log('Photo taken:', uri, fileName);
          setUploadedImage({ uri, fileName });
        }
      }
    );
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
        {/* <TouchableOpacity style={AppStyles.replyButton} onPress={handleDocumentPick}>
          <Text style={AppStyles.replyButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={AppStyles.replyButton} onPress={handleTakePhoto}>
          <Text style={AppStyles.replyButtonText}>📷</Text>
        </TouchableOpacity> */}
      </View>
      {uploadedImage && (
        <Image source={{ uri: uploadedImage.uri }} style={AppStyles.imagePreview} />
      )}
    </View>
  );
};

export default ComplaintReplyDetails;