import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import apiService from '../apiService';
import AppStyles from '../AppStyles';

const ComplaintDetails = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [complaints, setComplaints] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await apiService.getComplaints({ mobileno: searchTerm, createdBy: searchTerm });
      setComplaints(response);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Alert.alert('Error', 'Failed to fetch complaints');
    }
  };

  return (
    <ScrollView style={AppStyles.displayContainer}>
      <View style={AppStyles.displayContent}>
        <Text style={AppStyles.displayHeader}>Check Details</Text>
        <TextInput
          style={AppStyles.input}
          placeholder="Enter Mobile No or Created By"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={AppStyles.button} onPress={handleSearch}>
          <Text style={AppStyles.buttonText}>Search</Text>
        </TouchableOpacity>
        {complaints.length === 0 ? (
          <Text style={AppStyles.displayNoDataText}>No complaints found</Text>
        ) : (
          complaints.map((complaint, index) => (
            <View key={index} style={AppStyles.displaySection}>
              <Text style={AppStyles.displaySectionHeader}>Complaint {complaint.CategoryID}</Text>
              <View style={AppStyles.displayTable}>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>Description</Text>
                  <Text style={AppStyles.displayCell}>{complaint.Description}</Text>
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>Attachment DOC</Text>
                  <Text style={AppStyles.displayCell}>{complaint.AttachmentDOC || 'N/A'}</Text>
                </View>
                <View style={AppStyles.displayRow}>
                  <Text style={AppStyles.displayCellHeader}>User Image</Text>
                  <Text style={AppStyles.displayCell}>{complaint.UserImage || 'N/A'}</Text>
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
                onPress={() => navigation.navigate('ComplaintReplyDetails', { complaint })}
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