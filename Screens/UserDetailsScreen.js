import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AppStyles from '../AppStyles';

const UserDetailsScreen = ({ route, navigation }) => {
  const { user } = route.params;

  return (
    <ScrollView style={AppStyles.displayContainer}>
      <View style={AppStyles.displayContent}>
        <Text style={AppStyles.displayHeader}>User Details</Text>
        <View style={AppStyles.displayTable}>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>User ID</Text>
            <Text style={AppStyles.displayCell}>{user.UserID}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Username</Text>
            <Text style={AppStyles.displayCell}>{user.Username}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Mobile No</Text>
            <Text style={AppStyles.displayCell}>{user.MobileNo}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Email ID</Text>
            <Text style={AppStyles.displayCell}>{user.EmailID}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Zone ID</Text>
            <Text style={AppStyles.displayCell}>{user.ZoneID}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Locality</Text>
            <Text style={AppStyles.displayCell}>{user.Locality}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Colony</Text>
            <Text style={AppStyles.displayCell}>{user.Colony}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Galli Number</Text>
            <Text style={AppStyles.displayCell}>{user.GalliNumber}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>House Number</Text>
            <Text style={AppStyles.displayCell}>{user.HouseNumber}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>GeoLocation</Text>
            <Text style={AppStyles.displayCell}>{user.GeoLocation}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Created By</Text>
            <Text style={AppStyles.displayCell}>{user.CreatedBy}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Created Date</Text>
            <Text style={AppStyles.displayCell}>{user.CreatedDate}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Modified By</Text>
            <Text style={AppStyles.displayCell}>{user.ModifiedBy}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Modified Date</Text>
            <Text style={AppStyles.displayCell}>{user.ModifiedDate}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Is Admin</Text>
            <Text style={AppStyles.displayCell}>{user.isAdmin ? 'Yes' : 'No'}</Text>
          </View>
          <View style={AppStyles.displayRow}>
            <Text style={AppStyles.displayCellHeader}>Is Active</Text>
            <Text style={AppStyles.displayCell}>{user.IsActive ? 'Yes' : 'No'}</Text>
          </View>
        </View>
        <TouchableOpacity style={AppStyles.button} onPress={() => navigation.goBack()}>
          <Text style={AppStyles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UserDetailsScreen;