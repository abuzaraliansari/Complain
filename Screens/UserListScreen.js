import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AppStyles from '../AppStyles';
import apiService from '../apiService';

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [zone, setZone] = useState('');
  const [locality, setLocality] = useState('');
  const [colony, setColony] = useState('');
  const [galliNumber, setGalliNumber] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await apiService.getUsers({ zone, locality, colony, galliNumber });
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [zone, locality, colony, galliNumber]);

  const handleViewDetails = (user) => {
    navigation.navigate('UserDetailsScreen', { user });
  };

  return (
    <ScrollView style={AppStyles.container}>
      <View style={AppStyles.container}>
        <Text style={AppStyles.title}>User List</Text>

        <View style={AppStyles.filterContainer}>
          <Text style={AppStyles.filterLabel}>Zone</Text>
          <Picker
            selectedValue={zone}
            onValueChange={(itemValue) => setZone(itemValue)}
            style={AppStyles.picker}
          >
            <Picker.Item label="All" value="" />
            <Picker.Item label="North" value="North" />
            <Picker.Item label="South" value="South" />
            <Picker.Item label="East" value="East" />
            <Picker.Item label="West" value="West" />
          </Picker>

          <Text style={AppStyles.filterLabel}>Locality</Text>
          <TextInput
            style={AppStyles.input}
            placeholder="Enter Locality"
            value={locality}
            onChangeText={setLocality}
          />

          <Text style={AppStyles.filterLabel}>Colony</Text>
          <TextInput
            style={AppStyles.input}
            placeholder="Enter Colony"
            value={colony}
            onChangeText={setColony}
          />

          <Text style={AppStyles.filterLabel}>Galli Number</Text>
          <TextInput
            style={AppStyles.input}
            placeholder="Enter Galli Number"
            value={galliNumber}
            onChangeText={setGalliNumber}
          />

          <TouchableOpacity style={AppStyles.button} onPress={fetchUsers}>
            <Text style={AppStyles.buttonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>

        {users.length > 0 ? (
          users.map((user) => (
            <View key={user.UserID} style={AppStyles.userTile}>
              <View style={AppStyles.userRow}>
                <Text style={AppStyles.userLabel}>User ID:</Text>
                <TouchableOpacity onPress={() => handleViewDetails(user)}>
                  <Text style={AppStyles.userValueLink}>{user.UserID}</Text>
                </TouchableOpacity>
              </View>
              <View style={AppStyles.userRow}>
                <Text style={AppStyles.userLabel}>Username:</Text>
                <Text style={AppStyles.userValue}>{user.Username}</Text>
              </View>
              <View style={AppStyles.userRow}>
                <Text style={AppStyles.userLabel}>Mobile No:</Text>
                <Text style={AppStyles.userValue}>{user.MobileNo}</Text>
              </View>
              <View style={AppStyles.userRow}>
                <Text style={AppStyles.userLabel}>Email ID:</Text>
                <Text style={AppStyles.userValue}>{user.EmailID}</Text>
              </View>
              <View style={AppStyles.userRow}>
                <Text style={AppStyles.userLabel}>Zone ID:</Text>
                <Text style={AppStyles.userValue}>{user.ZoneID}</Text>
              </View>
              <View style={AppStyles.userRow}>
                <Text style={AppStyles.userLabel}>Locality:</Text>
                <Text style={AppStyles.userValue}>{user.Locality}</Text>
              </View>
              <View style={AppStyles.userRow}>
                <Text style={AppStyles.userLabel}>GeoLocation:</Text>
                <Text style={AppStyles.userValue}>{user.GeoLocation}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={AppStyles.noDataText}>No users found</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default UserListScreen;