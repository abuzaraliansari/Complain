import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import apiService from '../apiService';
import AppStyles from '../AppStyles';
import { AuthContext } from '../Contexts/AuthContext';

const ComplaintDetails = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const { userDetails, setCategoryID } = useContext(AuthContext);

  const fetchComplaints = async () => {
    try {
      const response = userDetails.isAdmin
        ? await apiService.getAllComplaintsByDateRange({ startDate, endDate })
        : await apiService.getComplaints({ mobileno: userDetails.mobileno, createdBy: userDetails.username, isAdmin: userDetails.isAdmin });
      setComplaints(response);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Alert.alert('Error', 'Failed to fetch complaints');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [startDate, endDate]);

  const handleViewReplies = () => {
    if (selectedComplaint) {
      const selectedComplaintDetails = complaints.find(complaint => complaint.CategoryID === selectedComplaint);
      setCategoryID(selectedComplaint);
      navigation.navigate('ComplaintReplyDetails', { complaintno: selectedComplaint, attachmentDoc: selectedComplaintDetails.AttachmentDOC });
    } else {
      Alert.alert('Error', 'Please select a complaint');
    }
  };

  return (
    <ScrollView style={AppStyles.displayContainer}>
      <View style={AppStyles.displayContent}>
        <Text style={AppStyles.displayHeader}>Select Date Range</Text>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
          <Text style={AppStyles.datePickerText}>Start Date: {startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartDatePicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
          <Text style={AppStyles.datePickerText}>End Date: {endDate.toDateString()}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndDatePicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
        <Text style={AppStyles.displayHeader}>Select Complaint</Text>
        <Picker
          selectedValue={selectedComplaint}
          onValueChange={(itemValue) => setSelectedComplaint(itemValue)}
          style={AppStyles.picker}
        >
          <Picker.Item label="Select a complaint" value={null} />
          {complaints.map((complaint) => (
            <Picker.Item key={complaint.CategoryID} label={`Complaint ID ${complaint.CategoryID}`} value={complaint.CategoryID} />
          ))}
        </Picker>
        <TouchableOpacity style={AppStyles.button} onPress={handleViewReplies}>
          <Text style={AppStyles.buttonText}>View Replies</Text>
        </TouchableOpacity>
        {selectedComplaint && (
          <View style={AppStyles.displaySection}>
            <Text style={AppStyles.displaySectionHeader}>Complaint Details</Text>
            {complaints
              .filter((complaint) => complaint.CategoryID === selectedComplaint)
              .map((complaint, index) => (
                <View key={index} style={AppStyles.displayTable}>
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
              ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ComplaintDetails;