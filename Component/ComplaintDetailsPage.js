import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AppStyles from '../AppStyles';
import apiService from '../apiService';
import { AuthContext } from '../Contexts/AuthContext';

const ComplaintDetailsPage = ({ route, navigation }) => {
  const { complaint } = route.params;
  const { userDetails } = useContext(AuthContext);

  const handleUpdateComplaintStatus = async (status) => {
    try {
      console.log(`${status === 'Closed' ? 'Closing' : 'Opening'} complaint:`, complaint.ComplaintID);
      const apiMethod = status === 'Closed' ? apiService.updateComplaintStatus : apiService.updateComplaintStatusOpen;
      await apiMethod({
        complaintno: complaint.ComplaintID,
        status,
        modifiedBy: userDetails.username,
      });
      Alert.alert('Success', `Complaint ${status === 'Closed' ? 'closed' : 'opened'} successfully`);
      navigation.replace('Home');
    } catch (error) {
      console.error(`Error ${status === 'Closed' ? 'closing' : 'opening'} complaint:`, error);
      Alert.alert('Error', `Failed to ${status === 'Closed' ? 'close' : 'open'} complaint`);
    }
  };

  const confirmUpdateComplaintStatus = (status) => {
    Alert.alert(
      `${status === 'Closed' ? 'Close' : 'Open'} Complaint`,
      `Are you sure you want to ${status === 'Closed' ? 'close' : 'open'} this complaint?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => handleUpdateComplaintStatus(status) },
      ],
      { cancelable: false }
    );
  };

  const handleReplyNavigation = () => {
    if (complaint.ComplaintsStatus === 'Closed') {
      Alert.alert('Error', 'The complaint is closed. Please open it before replying.');
    } else {
      navigation.navigate('ComplaintReplyDetails', { complaintno: complaint.ComplaintID });
    }
  };

  return (
    <ScrollView style={AppStyles.displayContainer}>
      <View style={AppStyles.displayContent}>
        <Text style={AppStyles.displayHeader}>Complaint Details</Text>
        <View style={AppStyles.displayTable}>
        <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Complaint ID</Text>
            <Text style={AppStyles.displayCell}>{complaint.ComplaintID || 'N/A'}</Text>
          </View>

          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>User ID</Text>
            <Text style={AppStyles.displayCell}>{complaint.UserID || 'N/A'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Complaint Type</Text>
            <Text style={AppStyles.displayCell}>{complaint.ComplaintsType || 'N/A'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Complaint Status</Text>
            <Text style={AppStyles.displayCell}>{complaint.ComplaintsStatus || 'N/A'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Mobile No</Text>
            <Text style={AppStyles.displayCell}>{complaint.MobileNo || 'N/A'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Description</Text>
            <Text style={AppStyles.displayCell}>{complaint.Description || 'N/A'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Location</Text>
            <Text style={AppStyles.displayCell}>{complaint.Location || 'N/A'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Zone ID</Text>
            <Text style={AppStyles.displayCell}>{complaint.ZoneID || 'N/A'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Locality ID</Text>
            <Text style={AppStyles.displayCell}>{complaint.LocalityID || 'N/A'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Colony</Text>
            <Text style={AppStyles.displayCell}>{complaint.Colony || 'N/A'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>IP Address</Text>
            <Text style={AppStyles.displayCell}>{complaint.IPAddress || 'N/A'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Created By</Text>
            <Text style={AppStyles.displayCell}>{complaint.CreatedBy || 'N/A'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Created Date</Text>
            <Text style={AppStyles.displayCell}>{complaint.CreatedDate || 'N/A'}</Text>
          </View>
        </View>
        <View style={AppStyles.buttonContainer}>
          <TouchableOpacity style={AppStyles.replyButton} onPress={handleReplyNavigation}>
            <Text style={AppStyles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={AppStyles.closeButton} onPress={() => confirmUpdateComplaintStatus(complaint.ComplaintsStatus === 'Open' ? 'Closed' : 'Open')}>
            <Text style={AppStyles.closeButtonText}>{complaint.ComplaintsStatus === 'Open' ? 'Close Complaint' : 'Open Complaint'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={AppStyles.button} onPress={() => navigation.goBack()}>
          <Text style={AppStyles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ComplaintDetailsPage;