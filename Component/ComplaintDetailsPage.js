import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import AppStyles from '../AppStyles';
import apiService from '../apiService';
import { AuthContext } from '../Contexts/AuthContext';

const ComplaintDetailsPage = ({ route, navigation }) => {
  const { complaint } = route.params;
  const { userDetails } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState('');

  const handleUpdateComplaintStatus = async (status) => {
    try {
      console.log(`${status === 'Closed' ? 'Closing' : 'Opening'} complaint:`, complaint.ComplaintID);
  
      // Prepare the data for the API
      const replyCommentData = {
        complaintID: complaint.ComplaintID,
        commentDescription: reason,
        status: status,
        createdBy: `${userDetails.firstName} ${userDetails.username}`,
        isAdmin: userDetails.roles.includes('Admin') ? 1 : 0,
      };
  
      console.log('Data being sent to submitReplyComment API:', replyCommentData);
  
      // Save the reason in the ReplyComments table
      await apiService.submitReplyComment(replyCommentData);
  
      // Update the complaint status
      const apiMethod = status === 'Closed' ? apiService.updateComplaintStatus : apiService.updateComplaintStatusOpen;
      await apiMethod({
        complaintno: complaint.ComplaintID,
        status,
        modifiedBy: `${userDetails.firstName} ${userDetails.username}`,
      });
  
      Alert.alert('Success', `Complaint ${status === 'Closed' ? 'closed' : 'opened'} successfully`);
      setModalVisible(false); // Close the modal
      navigation.replace('ComplaintStatus', {
        CreatedDate: complaint.CreatedDate,
        ComplaintID: complaint.ComplaintID,
        source: 'Home',
      });
    } catch (error) {
      console.error(`Error ${status === 'Closed' ? 'closing' : 'opening'} complaint:`, error);
      Alert.alert('Error', `Failed to ${status === 'Closed' ? 'close' : 'open'} complaint`);
    }
  };

  const confirmUpdateComplaintStatus = (status) => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason before submitting.');
      return;
    }

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

  const handleOpenModal = () => {
    setReason(''); // Clear the reason input
    setModalVisible(true); // Open the modal
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <ScrollView style={AppStyles.displayContainer}>
      <View style={AppStyles.displayContent}>
        <Text style={AppStyles.displayHeader}>Complaint Details</Text>
        <View style={AppStyles.displayTable}>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Complaint No</Text>
            <Text style={AppStyles.displayCell}>{complaint.ComplaintRegistrationNo || 'N/A'}</Text>
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
            <Text style={AppStyles.displayCellHeader}>Description</Text>
            <Text style={AppStyles.displayCell}>{complaint.Description || 'N/A'}</Text>
          </View>
          {userDetails.roles.includes('Admin') && (
            <>
              <View style={AppStyles.displayRow}>
                <Text style={AppStyles.displayCellHeader}>Complaint ID</Text>
                <Text style={AppStyles.displayCell}>{complaint.ComplaintID || 'N/A'}</Text>
              </View>
              <View style={AppStyles.displayRow}>
                <Text style={AppStyles.displayCellHeader}>User ID</Text>
                <Text style={AppStyles.displayCell}>{complaint.UserID || 'N/A'}</Text>
              </View>
              <View style={AppStyles.displayRow}>
                <Text style={AppStyles.displayCellHeader}>Mobile No</Text>
                <Text style={AppStyles.displayCell}>{complaint.MobileNo || 'N/A'}</Text>
              </View>
              <View style={AppStyles.displayRow}>
                <Text style={AppStyles.displayCellHeader}>Location</Text>
                <Text style={AppStyles.displayCell}>{complaint.Location || 'N/A'}</Text>
              </View>
              <View style={AppStyles.displayRow}>
                <Text style={AppStyles.displayCellHeader}>Zone ID</Text>
                <Text style={AppStyles.displayCell}>{complaint.zone || 'N/A'}</Text>
              </View>
              <View style={AppStyles.displayRow}>
                <Text style={AppStyles.displayCellHeader}>Locality ID</Text>
                <Text style={AppStyles.displayCell}>{complaint.locality || 'N/A'}</Text>
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
            </>
          )}
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Created Date</Text>
            <Text style={AppStyles.displayCell}>{complaint.CreatedDate ? formatDate(complaint.CreatedDate) : 'N/A'}</Text>
          </View>
        </View>
        <View style={AppStyles.buttonContainer}>
          <TouchableOpacity style={AppStyles.replyButton} onPress={() => navigation.navigate('ComplaintReply', { complaintno: complaint.ComplaintID })}>
            <Text style={AppStyles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={AppStyles.closeButton} onPress={handleOpenModal}>
            <Text style={AppStyles.closeButtonText}>{complaint.ComplaintsStatus === 'Open' ? 'Close Complaint' : 'Open Complaint'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={AppStyles.button} onPress={() => navigation.goBack()}>
          <Text style={AppStyles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for entering reason */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={AppStyles.modalContainer}>
          <View style={AppStyles.modalContent}>
            <Text style={AppStyles.modalHeader}>Reason for {complaint.ComplaintsStatus === 'Open' ? 'Closing' : 'Opening'} Complaint</Text>
            <TextInput
              style={AppStyles.input}
              placeholder="Enter reason here"
              value={reason}
              onChangeText={setReason}
              multiline
            />
            <View style={AppStyles.modalButtonContainer}>
              <TouchableOpacity style={AppStyles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={AppStyles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={AppStyles.replyButton}
                onPress={() => confirmUpdateComplaintStatus(complaint.ComplaintsStatus === 'Open' ? 'Closed' : 'Open')}
              >
                <Text style={AppStyles.replyButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ComplaintDetailsPage;