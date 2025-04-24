import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppStyles from '../AppStyles';
import apiService from '../apiService';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { AuthContext } from '../Contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const ComplaintForm = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [attachmentDoc, setAttachmentDoc] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [complaintType, setComplaintType] = useState('');
  const [complaintStatus, setComplaintStatus] = useState('Open');
  const [ipAddress, setIpAddress] = useState('');
  const [zoneID, setZoneID] = useState('');
  const [localityID, setLocalityID] = useState('');
  const [colony, setColony] = useState('');
  const [localities, setLocalities] = useState([]);
  const [colonies, setColonies] = useState([]);
  const [showAddColony, setShowAddColony] = useState(false);
  const [newColony, setNewColony] = useState('');

  const { userDetails, authToken } = useContext(AuthContext);
  const route = useRoute();
  const { latitude, longitude } = route.params || {};

  useEffect(() => {
    if (latitude && longitude) {
      setLocation({ latitude, longitude });
    } else if (userDetails.geoLocation) {
      const [lat, lon] = userDetails.geoLocation.split(',');
      setLocation({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
    }
    fetchIpAddress();
  }, [latitude, longitude, userDetails.geoLocation]);

  useEffect(() => {
    if (zoneID) {
      fetchLocalities(zoneID);
    }
  }, [zoneID]);

  useEffect(() => {
    if (localityID) {
      fetchColonies(localityID);
    }
  }, [localityID]);

  useEffect(() => {
    if (userDetails) {
      setZoneID(userDetails.zoneID);
      setLocalityID(userDetails.locality);
      setColony(userDetails.colony);
    }
  }, [userDetails]);

  const fetchIpAddress = async () => {
    try {
      console.log('Fetching IP address...');
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      console.log('IP address fetched:', data.ip);
      setIpAddress(data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
      setIpAddress('Unable to fetch IP address');
    }
  };

  const fetchLocalities = async (zoneID) => {
    try {
      console.log('Fetching localities for zoneID:', zoneID);
      const response = await apiService.getLocalities({ ZoneID: zoneID }, authToken);
      console.log('Localities fetched:', response);
      setLocalities(response.locality[0]);
    } catch (error) {
      console.error('Error fetching localities:', error);
    }
  };

  const fetchColonies = async (localityID) => {
    try {
      console.log('Fetching colonies for localityID:', localityID);
      const response = await apiService.getColonies({ LocalityID: localityID }, authToken);
      console.log('Colonies fetched:', response);
      setColonies(response.locality[0]);
    } catch (error) {
      console.error('Error fetching colonies:', error);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      return result === RESULTS.GRANTED;
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      return;
    }

    launchCamera(
      { mediaType: 'photo', saveToPhotos: true },
      async (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.log('Camera error:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const { uri, fileName, fileSize } = response.assets[0];
          const newFileName = fileName;
          setUserImage({ uri, fileName: newFileName, fileSize });

          // Save photo details locally
          try {
            await AsyncStorage.setItem(
              'capturedPhotos',
              JSON.stringify([{ uri, fileName: newFileName, fileSize }]),
            );
            Alert.alert('Success', 'Photo saved locally.');
          } catch (error) {
            console.error('Error saving photo to local storage:', error);
            Alert.alert('Error', 'Failed to save photo locally.');
          }
        }
      }
    );
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      if (result) {
        const { name: documentName, size: documentSize, type: documentType, uri: documentUri } = result;
        setAttachmentDoc({ documentName, documentUri, documentSize, documentType });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'Document selection was cancelled.');
      } else {
        Alert.alert('Error', 'Document selection failed.');
      }
    }
  };

  const handleAddColony = async () => {
    if (!newColony) {
      Alert.alert('Error', 'Please enter the new colony name.');
      return;
    }

    try {
      console.log('Adding new colony:', newColony);
      const response = await apiService.addColony({ LocalityID: localityID, Colony: newColony }, authToken);
      console.log('Add colony response:', response);
      if (response.success) {
        Alert.alert('Success', 'New colony added successfully.');
        setShowAddColony(false);
        setNewColony('');
        fetchColonies(localityID); // Refresh the colonies list
      } else {
        Alert.alert('Error', 'Failed to add new colony.');
      }
    } catch (error) {
      console.error('Error adding new colony:', error);
      Alert.alert('Error', 'Failed to add new colony.');
    }
  };

  const handleSubmit = async () => {
    console.log('Submit button clicked');
    if (userDetails.emailID && !userDetails.emailID.endsWith('@gmail.com')) {
      Alert.alert('Error', 'Email must end with @gmail.com');
      return;
    }
    if (!complaintType) {
      Alert.alert('Error', 'Complaint Type cannot be null');
      return;
    }
    if (!location) {
      Alert.alert('Error', 'Location cannot be fetch. Please move to another place and try to fetch the location.');
      return;
    }
    if (!zoneID) {
      Alert.alert('Error', 'Zone cannot be null');
      return;
    }
    if (!localityID) {
      Alert.alert('Error', 'Locality Ward Sankhya cannot be null');
      return;
    }
    if (!colony) {
      Alert.alert('Error', 'Colony cannot be null');
      return;
    }

    const formattedAttachmentDoc = attachmentDoc ? `${userDetails.userID}_${userDetails.mobileNumber}_${attachmentDoc.documentName}` : null;
    const formattedUserImage = userImage ? `${userDetails.userID}_${userDetails.mobileNumber}_${userImage.fileName}` : null;
    console.log('Formatted Attachment Doc:', formattedAttachmentDoc);
    const complaintData = {
      description,
      location: location ? `${location.latitude},${location.longitude}` : null,
      createdBy: `${userDetails.firstName} ${userDetails.username}`, // Updated createdBy
      createdDate: new Date(),
      mobileNumber: userDetails.mobileNumber,
      complaintStatus,
      ipAddress,
      isAdmin: userDetails.isAdmin,
      userID: userDetails.userID,
      complaintType,
      zoneID,
      localityID,
      colony,
      locality: userDetails.localityName,
      zone: userDetails.zoneName,
    };

    try {
      console.log('Calling submitComplaint API...');
      const complaintResponse = await apiService.submitComplaint(complaintData);
      console.log('Complaint API response:', complaintResponse);

      if (complaintResponse.success) {
        const complaintID = complaintResponse.complaintID;
        const complaintRegistrationNo = complaintResponse.complaintRegistrationNo;
        const filesData = new FormData();
        filesData.append('userID', userDetails.userID);
        filesData.append('complaintID', complaintID);
        filesData.append('createdBy', `${userDetails.firstName} ${userDetails.username}`); // Updated createdBy
        if (attachmentDoc) {
          filesData.append('attachmentDoc', {
            uri: attachmentDoc.documentUri,
            type: attachmentDoc.documentType,
            name: attachmentDoc.documentName,
          });
        }
        if (userImage) {
          filesData.append('userImage', {
            uri: userImage.uri,
            type: 'image/jpeg',
            name: userImage.fileName,
          });
        }

        console.log('Calling submitFiles API...');
        const filesResponse = await apiService.submitFiles(filesData);
        console.log('Files API response:', filesResponse);

        if (filesResponse.success) {
          Alert.alert('Success', `Complaint submitted successfully. Complaint Registration No: ${complaintRegistrationNo}, Mobile No: ${userDetails.mobileNumber}, Username: ${userDetails.firstName}`);
          navigation.replace('Home');
        } else {
          Alert.alert('Error', 'Failed to submit files');
        }
      } else {
        Alert.alert('Error', 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert('Error', `Failed to submit complaint: ${error.message}`);
    }
  };

  const isAdmin = userDetails.roles && userDetails.roles.includes('Admin');

  return (
    <ScrollView contentContainerStyle={AppStyles.scrollContainer}>
      <View style={AppStyles.container}>
        <Text style={AppStyles.title}>Submit Complaint</Text>
        <Text style={AppStyles.subtitle}>IP Address: {ipAddress}</Text>
        <Text style={AppStyles.label}>Complaint Type</Text>
        <View >
          <Picker
            selectedValue={complaintType}
            style={AppStyles.picker}
            onValueChange={(itemValue) => setComplaintType(itemValue)}
          >
            <Picker.Item label="Select Complaint Type" value="" />
            <Picker.Item label="Water" value="water" />
            <Picker.Item label="Road" value="road" />
            <Picker.Item label="Electricity" value="electricity" />
            <Picker.Item label="Waste" value="waste" />
            <Picker.Item label="Others" value="others" />
          </Picker>
        </View>
        <Text style={AppStyles.label}>Description</Text>
        <TextInput
          style={AppStyles.inputt}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          numberOfLines={5} // Set to 5 lines as requested
          scrollEnabled={true} // Enable scrolling within the TextInput
        />
        {isAdmin && (
          <>
            <Text style={AppStyles.label}>User ID</Text>
            <TextInput
              style={AppStyles.input}
              placeholder="User ID"
              value={userDetails.userID.toString()}
              editable={false}
            />
            <Text style={AppStyles.label}>Mobile No</Text>
            <TextInput
              style={AppStyles.input}
              placeholder="Mobile No"
              value={userDetails.mobileNumber}
              editable={false}
            />
            <Text style={AppStyles.label}>Email ID</Text>
            <TextInput
              style={AppStyles.input}
              placeholder="Email ID"
              value={userDetails.emailID}
              editable={false}
            />
            <Text style={AppStyles.label}>Location</Text>
            <TextInput
              style={AppStyles.input}
              placeholder="Location"
              value={location ? `${location.latitude}, ${location.longitude}` : ''}
              editable={false}
            />
            <Text style={AppStyles.label}>Zone</Text>
            <TextInput
              style={AppStyles.input}
              placeholder="Zone"
              value={userDetails.zoneName}
              editable={false}
            />
            <Text style={AppStyles.label}>Locality Ward Sankhya</Text>
            <TextInput
              style={AppStyles.input}
              placeholder="Locality Ward Sankhya"
              value={userDetails.localityName}
              editable={false}
            />
            <Text style={AppStyles.label}>Colony</Text>
            <TextInput
              style={AppStyles.input}
              placeholder="Colony"
              value={userDetails.colonyName}
              editable={false}
            />
          </>
        )}
        {showAddColony && (
          <View>
            <TextInput
              style={AppStyles.input}
              placeholder="Enter New Colony Name"
              value={newColony}
              onChangeText={setNewColony}
            />
            <TouchableOpacity
              style={[AppStyles.button, AppStyles.probutton]}
              onPress={handleAddColony}>
              <Text style={AppStyles.buttonText}>Add Colony</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={AppStyles.label}>Document</Text>
        <TouchableOpacity style={AppStyles.button} onPress={handleDocumentPick}>
          <Text style={AppStyles.buttonText}>
            {attachmentDoc ? 'Change Document' : 'Upload Document'}
          </Text>
        </TouchableOpacity>
        {attachmentDoc && (
          <View style={AppStyles.documentContainer}>
            <Icon name="insert-drive-file" size={30} color="#000" />
            <Text style={AppStyles.documentText}>{attachmentDoc.documentName}</Text>
          </View>
        )}
        <Text style={AppStyles.label}>Photo</Text>
        <TouchableOpacity style={AppStyles.button} onPress={handleTakePhoto}>
          <Text style={AppStyles.buttonText}>
            {userImage ? 'Change Photo' : 'Take Photo'}
          </Text>
        </TouchableOpacity>
        {userImage && (
          <Image source={{ uri: userImage.uri }} style={AppStyles.imagePreview} />
        )}
        <TouchableOpacity style={AppStyles.button} onPress={handleSubmit}>
          <Text style={AppStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ComplaintForm;