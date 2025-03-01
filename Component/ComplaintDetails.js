import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, TextInput } from 'react-native';
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
  const [filterMobileNumber, setFilterMobileNumber] = useState('');
  const { userDetails, setCategoryID } = useContext(AuthContext);

  const fetchComplaints = async () => {
    try {
      console.log("Fetching complaints with the following parameters:");
      console.log("Mobile Number:", userDetails.mobileNumber);
      console.log("Created By:", userDetails.username);
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
      console.log("Complaint Type:", complaintType);
      console.log("Complaint Status:", complaintStatus);

      const response = await apiService.getComplaints({
        mobileNumber: userDetails.roles.includes('Admin') ? filterMobileNumber : userDetails.mobileNumber,
        createdBy: userDetails.username,
        isAdmin: userDetails.roles.includes('Admin'),
        startDate,
        endDate,
        complaintType,
        complaintStatus
      });

      console.log("API response:", response);

      setComplaints(response);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Alert.alert('Error', 'Failed to fetch complaints');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [startDate, endDate, complaintType, complaintStatus, filterMobileNumber]);

  const handleViewDetails = (complaint) => {
    navigation.navigate('ComplaintDetailsPage', { complaint });
  };

  const handleReply = (complaintID) => {
    navigation.navigate('ComplaintReplyPage', { complaintID });
  };

  return (
    <ScrollView style={AppStyles.container}>
      <Animatable.View animation="fadeInUp" style={AppStyles.container}>
        <Text style={AppStyles.header}>Select Date Range</Text>
        <View style={AppStyles.datePickerContainer}>
          <View style={AppStyles.datePickerBox}>
            <Text style={AppStyles.datePickerLabel}>Start Date:</Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
              <Text style={AppStyles.datePickerText}>{startDate.toDateString()}</Text>
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
          </View>
          <View style={AppStyles.datePickerBox}>
            <Text style={AppStyles.datePickerLabel}>End Date:</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Text style={AppStyles.datePickerText}>{endDate.toDateString()}</Text>
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
        </View>
        {userDetails.roles.includes('Admin') && (
          <View style={AppStyles.inputContainer}>
            <Text style={AppStyles.label}>Filter by Mobile Number</Text>
            <TextInput
              style={AppStyles.input}
              placeholder="Enter Mobile Number"
              value={filterMobileNumber}
              onChangeText={setFilterMobileNumber}
            />
          </View>
        )}
        <Text style={AppStyles.header}>Select Type And Status</Text>
        <View style={AppStyles.pickerContainer}>
          <View style={AppStyles.pickerBox}>
            <Text style={AppStyles.pickerLabel}>Complaint Type</Text>
            <Picker
              selectedValue={complaintType}
              onValueChange={(itemValue) => setComplaintType(itemValue)}
              style={AppStyles.picker}
            >
              <Picker.Item label="Type" value="" />
              <Picker.Item label="Water" value="water" />
              <Picker.Item label="Road" value="road" />
              <Picker.Item label="Electricity" value="electricity" />
              <Picker.Item label="Waste" value="waste" />
              <Picker.Item label="Others" value="others" />
            </Picker>
          </View>
          <View style={AppStyles.pickerBox}>
            <Text style={AppStyles.pickerLabel}>Complaint Status</Text>
            <Picker
              selectedValue={complaintStatus}
              onValueChange={(itemValue) => setComplaintStatus(itemValue)}
              style={AppStyles.picker}
            >
              <Picker.Item label="Status" value="" />
              <Picker.Item label="Open" value="Open" />
              <Picker.Item label="Closed" value="Closed" />
            </Picker>
          </View>
        </View>
        <Text style={AppStyles.header}>Complaints</Text>
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <Animatable.View key={complaint.ComplaintID} animation="fadeInUp" style={AppStyles.complaintBox}>
              <View style={AppStyles.complaintRow}>
                <Text style={AppStyles.complaintLabel}>Complaint ID:</Text>
                <TouchableOpacity onPress={() => handleViewDetails(complaint)}>
                  <Text style={AppStyles.complaintValueLink}>{complaint.ComplaintID}</Text>
                </TouchableOpacity>
              </View>
              <View style={AppStyles.complaintRow}>
                <Text style={AppStyles.complaintLabel}>Type:</Text>
                <Text style={AppStyles.complaintValue}>{complaint.ComplaintsType}</Text>
              </View>
              <View style={AppStyles.complaintRow}>
                <Text style={AppStyles.complaintLabel}>Status:</Text>
                <Text style={AppStyles.complaintValue}>{complaint.ComplaintsStatus}</Text>
              </View>
              <View style={AppStyles.complaintRow}>
                <Text style={AppStyles.complaintLabel}>Mobile No:</Text>
                <Text style={AppStyles.complaintValue}>{complaint.MobileNo}</Text>
              </View>
              <View style={AppStyles.complaintRow}>
                <Text style={AppStyles.complaintLabel}>Location:</Text>
                <Text style={AppStyles.complaintValue}>{complaint.Location}</Text>
              </View>
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