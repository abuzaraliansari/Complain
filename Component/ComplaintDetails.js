import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import apiService from '../apiService';
import AppStyles from '../AppStyles';
import { AuthContext } from '../Contexts/AuthContext';

const ComplaintDetails = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const { userDetails, setCategoryID } = useContext(AuthContext);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await apiService.getComplaints({ mobileno: userDetails.mobileno, createdBy: userDetails.username });
        setComplaints(response);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        Alert.alert('Error', 'Failed to fetch complaints');
      }
    };

    fetchComplaints();
  }, [userDetails]);

  const truncateText = (text, length) => {
    return text.length > length ? `${text.substring(0, length)}....` : text;
  };

  const handleViewReplies = (complaint) => {
    setCategoryID(complaint.CategoryID);
    navigation.navigate('ComplaintReplyDetails');
  };

  return (
    <ScrollView style={AppStyles.displayContainer}>
      <View style={AppStyles.displayContent}>
        <Text style={AppStyles.displayHeader}>Check Details</Text>
        {complaints.length === 0 ? (
          <Text style={AppStyles.displayNoDataText}>No complaints found</Text>
        ) : (
          complaints.map((complaint, index) => (
            <View key={index} style={AppStyles.displaySection}>
              <Text style={AppStyles.displaySectionHeader}>Complaint ID {complaint.CategoryID}</Text>
              <View style={AppStyles.displayTable}>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>Description</Text>
                  <Text style={AppStyles.displayCell}>{complaint.Description}</Text>
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>Attachment DOC</Text>
                  {complaint.AttachmentDOC ? (
                    <View style={AppStyles.displayCell}>
                      <Icon name="insert-drive-file" size={20} color="#000" />
                      <Text>{truncateText(complaint.AttachmentDOC, 10)}</Text>
                    </View>
                  ) : (
                    <Text style={AppStyles.displayCell}>N/A</Text>
                  )}
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>User Image</Text>
                  {complaint.UserImage ? (
                    <View style={AppStyles.displayCell}>
                      <Image source={{ uri: complaint.UserImage }} style={AppStyles.imagePreview} />
                      <Text>{truncateText(complaint.UserImage, 10)}</Text>
                    </View>
                  ) : (
                    <Text style={AppStyles.displayCell}>N/A</Text>
                  )}
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>Location</Text>
                  <Text style={AppStyles.displayCell}>{complaint.Location || 'N/A'}</Text>
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>Created By</Text>
                  <Text style={AppStyles.displayCell}>{complaint.CreatedBy}</Text>
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>Created Date</Text>
                  <Text style={AppStyles.displayCell}>{new Date(complaint.CreatedDate).toLocaleString()}</Text>
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>Mobile No</Text>
                  <Text style={AppStyles.displayCell}>{complaint.mobileno}</Text>
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>Email ID</Text>
                  <Text style={AppStyles.displayCell}>{complaint.EmailID}</Text>
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>Complaint Status</Text>
                  <Text style={AppStyles.displayCell}>{complaint.ComplaintStatus}</Text>
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>IP Address</Text>
                  <Text style={AppStyles.displayCell}>{complaint.IPAddress}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={AppStyles.button}
                onPress={() => handleViewReplies(complaint)}
              >
                <Text style={AppStyles.buttonText}>View Replies</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default ComplaintDetails;