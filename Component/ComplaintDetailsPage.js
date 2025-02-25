import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import AppStyles from '../AppStyles';

const ComplaintDetailsPage = ({ route, navigation }) => {
  const { complaint } = route.params;

  const handleDownload = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={AppStyles.displayContainer}>
      <View style={AppStyles.displayContent}>
        <Text style={AppStyles.displayHeader}>Complaint Details</Text>
        <View style={AppStyles.displayTable}>
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
            <Text style={AppStyles.displayCellHeader}>Created By</Text>
            <Text style={AppStyles.displayCell}>{complaint.CreatedBy || 'N/A'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Created Date</Text>
            <Text style={AppStyles.displayCell}>{complaint.CreatedDate || 'N/A'}</Text>
          </View>
          {complaint.DocUrl && (
            <View style={AppStyles.displayRow}>
              <Text style={AppStyles.displayCellHeader}>Document</Text>
              <TouchableOpacity onPress={() => handleDownload(complaint.DocUrl)}>
                <Text style={AppStyles.displayCellLink}>Download Document</Text>
              </TouchableOpacity>
            </View>
          )}
          {complaint.ImageUrl && (
            <View style={AppStyles.displayRow}>
              <Text style={AppStyles.displayCellHeader}>Photo</Text>
              <TouchableOpacity onPress={() => handleDownload(complaint.ImageUrl)}>
                <Image source={{ uri: complaint.ImageUrl }} style={AppStyles.imagePreview} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TouchableOpacity style={AppStyles.button} onPress={() => navigation.goBack()}>
          <Text style={AppStyles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ComplaintDetailsPage;