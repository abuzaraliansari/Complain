import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import apiService from '../apiService';
import AppStyles from '../AppStyles';
import { AuthContext } from '../Contexts/AuthContext';

const ComplaintDetails = ({ navigation, route }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [complaintType, setComplaintType] = useState('');
  const [complaintStatus, setComplaintStatus] = useState('Open');
  const [filterMobileNumber, setFilterMobileNumber] = useState('');
  const [filterZone, setFilterZone] = useState('');
  const [filterLocality, setFilterLocality] = useState('');
  const [filterComplaintID, setFilterComplaintID] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const { userDetails, setCategoryID } = useContext(AuthContext);

  // Check if navigation comes from 'Home' and update state
  useEffect(() => {
    if (route.params?.source === 'Home') {
      const { CreatedDate, ComplaintID } = route.params;
      setFilterComplaintID(ComplaintID); // Set ComplaintID from route params
      setStartDate(new Date(new Date(CreatedDate).setDate(new Date(CreatedDate).getDate() - 1))); // Set startDate to CreatedDate - 1 day
      setComplaintStatus(''); // Set complaintStatus to 'All'
    }
  }, [route.params]);

  const fetchComplaints = async () => {
    try {
      const requestBody = {
        mobileNumber: userDetails.roles.includes('Admin') ? filterMobileNumber : userDetails.mobileNumber,
        createdBy: userDetails.username,
        isAdmin: userDetails.roles.includes('Admin'),
        startDate,
        endDate,
        complaintType,
        complaintStatus,
        zone: filterZone,
        locality: filterLocality,
        complaintID: filterComplaintID,
      };

      console.log("Fetching complaints with the following parameters:");
      console.log("Request Body:", JSON.stringify(requestBody, null, 2));

      const response = await apiService.getComplaints(requestBody);

      console.log("API response:", response);

      // Sort complaints by CreatedDate in descending order
      const sortedComplaints = response.sort((a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate));

      setComplaints(sortedComplaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Alert.alert('Error', 'Failed to fetch complaints');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} time: ${hours}:${minutes}`;
  };

  useEffect(() => {
    fetchComplaints();
  }, [startDate, endDate, complaintType, complaintStatus, filterMobileNumber, filterZone, filterLocality, filterComplaintID]);

  const handleViewDetails = (complaint) => {
    navigation.navigate('ComplaintDetails', { complaint });
  };

  const handleReply = (complaintID) => {
    navigation.navigate('ComplaintReplyPage', { complaintID });
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <ScrollView style={AppStyles.container}>
      <Animatable.View animation="fadeInUp" style={AppStyles.container}>
        <TouchableOpacity
          style={AppStyles.newFilterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={AppStyles.newFilterButtonText}>{showFilters ? 'Hide Filters' : 'Show Filters'}</Text>
        </TouchableOpacity>

        {showFilters && (
          <>
            <View style={AppStyles.rowContainer}>
              <Text style={AppStyles.label}>Start Date</Text>
              <View style={AppStyles.pickerWrapper}>
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                  <Text style={AppStyles.datePickerText}>{formatDate(startDate)}</Text>
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
              <Text style={AppStyles.label}>End Date</Text>
              <View style={AppStyles.pickerWrapper}>
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                  <Text style={AppStyles.datePickerText}>{formatDate(endDate)}</Text>
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

            <View style={AppStyles.rowContainer}>
              <Text style={AppStyles.label}>Type</Text>
              <View style={AppStyles.pickerWrapper}>
                <Picker
                  selectedValue={complaintType}
                  onValueChange={(itemValue) => setComplaintType(itemValue)}
                  style={AppStyles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="All" value="" />
                  <Picker.Item label="Water" value="water" />
                  <Picker.Item label="Road" value="road" />
                  <Picker.Item label="Electricity" value="electricity" />
                  <Picker.Item label="Waste" value="waste" />
                  <Picker.Item label="Others" value="others" />
                </Picker>
              </View>
              <Text style={AppStyles.label}>Status</Text>
              <View style={AppStyles.pickerWrapper}>
                <Picker
                  selectedValue={complaintStatus}
                  onValueChange={(itemValue) => setComplaintStatus(itemValue)}
                  style={AppStyles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="All" value="" />
                  <Picker.Item label="Open" value="Open" />
                  <Picker.Item label="Closed" value="Closed" />
                </Picker>
              </View>
            </View>

            {userDetails.roles.includes('Admin') && (
              <>
                <View style={AppStyles.rowContainer}>
                  <Text style={AppStyles.label}>Zone</Text>
                  <View style={AppStyles.pickerWrapper}>
                    <Picker
                      selectedValue={filterZone}
                      onValueChange={(itemValue) => setFilterZone(itemValue)}
                      style={AppStyles.picker}
                    >
                      <Picker.Item label="All" value="" />
                      <Picker.Item label="North" value="North" />
                      <Picker.Item label="South" value="South" />
                      <Picker.Item label="East" value="East" />
                      <Picker.Item label="West" value="West" />
                    </Picker>
                  </View>
                  <Text style={AppStyles.label}>Locality</Text>
                  <View style={AppStyles.pickerWrapper}>
                    <Picker
                      selectedValue={filterLocality}
                      onValueChange={(itemValue) => setFilterLocality(itemValue)}
                      style={AppStyles.picker}
                    >
                      <Picker.Item label="All" value="" />
                      <Picker.Item label="Locality Ward 1" value="Locality Ward 1" />
                      <Picker.Item label="Locality Ward 2" value="Locality Ward 2" />
                      <Picker.Item label="Locality Ward 3" value="Locality Ward 3" />
                      <Picker.Item label="Locality Ward 4" value="Locality Ward 4" />
                      <Picker.Item label="Locality Ward 5" value="Locality Ward 5" />
                      <Picker.Item label="Locality Ward 6" value="Locality Ward 6" />
                      <Picker.Item label="Locality Ward 7" value="Locality Ward 7" />
                      <Picker.Item label="Locality Ward 8" value="Locality Ward 8" />
                      <Picker.Item label="Locality Ward 9" value="Locality Ward 9" />
                      <Picker.Item label="Locality Ward 10" value="Locality Ward 10" />
                      <Picker.Item label="Locality Ward 11" value="Locality Ward 11" />
                      <Picker.Item label="Locality Ward 12" value="Locality Ward 12" />
                      <Picker.Item label="Locality Ward 13" value="Locality Ward 13" />
                      <Picker.Item label="Locality Ward 14" value="Locality Ward 14" />
                      <Picker.Item label="Locality Ward 15" value="Locality Ward 15" />
                      <Picker.Item label="Locality Ward 16" value="Locality Ward 16" />
                    </Picker>
                  </View>
                </View>

                <View style={AppStyles.inputContainer}>
                  <Text style={AppStyles.label}>Mobile</Text>
                  <TextInput
                    style={AppStyles.input}
                    placeholder="Enter Mobile Number"
                    value={filterMobileNumber}
                    onChangeText={setFilterMobileNumber}
                    keyboardType="numeric"
                  />
                </View>

                {/* Hidden ComplaintID Filter */}
                <View style={{ display: 'none' }}>
                  <Text style={AppStyles.label}>Complaint ID</Text>
                  <TextInput
                    style={AppStyles.input}
                    placeholder="Enter Complaint ID"
                    value={filterComplaintID}
                    onChangeText={setFilterComplaintID}
                    keyboardType="numeric"
                  />
                </View>
              </>
            )}
          </>
        )}

        <Text style={AppStyles.header}>Complaints</Text>
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <Animatable.View key={complaint.ComplaintID} animation="fadeInUp" style={AppStyles.complaintBox}>
              <View style={AppStyles.complaintRow}>
                <Text style={AppStyles.complaintLabel}>Registration No:</Text>
                <TouchableOpacity onPress={() => handleViewDetails(complaint)}>
                  <Text style={AppStyles.complaintValueLink}>{complaint.ComplaintRegistrationNo}</Text>
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
                <Text style={AppStyles.complaintLabel}>Zone:</Text>
                <Text style={AppStyles.complaintValue}>{complaint.zone}</Text>
              </View>
              <View style={AppStyles.complaintRow}>
                <Text style={AppStyles.complaintLabel}>Locality:</Text>
                <Text style={AppStyles.complaintValue}>{complaint.locality}</Text>
              </View>
              <View style={AppStyles.complaintRow}>
                <Text style={AppStyles.complaintLabel}>CreatedDate:</Text>
                <Text style={AppStyles.complaintValue}>{formatDateTime(complaint.CreatedDate)}</Text>
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