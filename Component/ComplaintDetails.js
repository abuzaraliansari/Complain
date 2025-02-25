import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import apiService from '../apiService';
import AppStyles from '../AppStyles';
import { AuthContext } from '../Contexts/AuthContext';

const ComplaintDetails = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [complaintType, setComplaintType] = useState('');
  const [complaintStatus, setComplaintStatus] = useState('');
  const { userDetails, setCategoryID } = useContext(AuthContext);

  const fetchComplaints = async () => {
    try {
      const response = await apiService.getComplaints({
        mobileNumber: userDetails.mobileNumber,
        createdBy: userDetails.username,
        startDate,
        endDate,
        complaintType,
        complaintStatus
      });
      setComplaints(response);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Alert.alert('Error', 'Failed to fetch complaints');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [startDate, endDate, complaintType, complaintStatus]);

  const handleViewDetails = (complaintID) => {
    navigation.navigate('ComplaintDetailsPage', { complaintID });
  };

  const handleReply = (complaintID) => {
    navigation.navigate('ComplaintReplyPage', { complaintID });
  };

  return (
    <ScrollView style={AppStyles.container}>
      <Animatable.View animation="fadeInUp" style={AppStyles.container}>
        <Text style={AppStyles.header}>Select Date Range</Text>
        <View style={AppStyles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={AppStyles.datePickerBox}>
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
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={AppStyles.datePickerBox}>
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
        </View>
        <Text style={AppStyles.header}>Select Complaint Type</Text>
        <View style={AppStyles.pickerBox}>
          <Picker
            selectedValue={complaintType}
            onValueChange={(itemValue) => setComplaintType(itemValue)}
            style={AppStyles.picker}
          >
            <Picker.Item label="Select Complaint Type" value="" />
            <Picker.Item label="Water" value="water" />
            <Picker.Item label="Road" value="road" />
            <Picker.Item label="Electricity" value="electricity" />
            <Picker.Item label="Waste" value="waste" />
            <Picker.Item label="Others" value="others" />
          </Picker>
        </View>
        <Text style={AppStyles.header}>Select Complaint Status</Text>
        <View style={AppStyles.pickerBox}>
          <Picker
            selectedValue={complaintStatus}
            onValueChange={(itemValue) => setComplaintStatus(itemValue)}
            style={AppStyles.picker}
          >
            <Picker.Item label="Select Complaint Status" value="" />
            <Picker.Item label="Open" value="Open" />
            <Picker.Item label="Closed" value="Closed" />
          </Picker>
        </View>
        <Text style={AppStyles.header}>Complaints</Text>
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <Animatable.View key={complaint.ComplaintID} animation="fadeInUp" style={AppStyles.displayRow}>
              <Text style={AppStyles.displayCell}>Complaint ID: {complaint.ComplaintID}</Text>
              <Text style={AppStyles.displayCell}>Type: {complaint.ComplaintType}</Text>
              <TouchableOpacity style={AppStyles.button} onPress={() => handleViewDetails(complaint.ComplaintID)}>
                <Text style={AppStyles.buttonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={AppStyles.button} onPress={() => handleReply(complaint.ComplaintID)}>
                <Text style={AppStyles.buttonText}>Reply</Text>
              </TouchableOpacity>
            </Animatable.View>
          ))
        ) : (
          <Text style={AppStyles.noDataText}>No complaints found</Text>
        )}
      </Animatable.View>
    </ScrollView>
  );
};

export default ComplaintDetails;