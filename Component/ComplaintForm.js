import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Alert, Image, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import DocumentPicker from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppStyles from '../AppStyles';
import apiService from '../apiService';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { AuthContext } from '../Contexts/AuthContext';

const ComplaintForm = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [attachmentDoc, setAttachmentDoc] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [complaintType, setComplaintType] = useState('');
  const [complaintStatus, setComplaintStatus] = useState('Open');
  const [ipAddress, setIpAddress] = useState('');

  const { userDetails } = useContext(AuthContext);
console.log('User Details:', userDetails);
  useEffect(() => {
    fetchLocation();
    fetchIpAddress();
  }, []);

  const fetchLocation = () => {
    setError(null);
    Geolocation.getCurrentPosition(
      position => {
        if (position.coords.accuracy <= 20) {
          setLocation(position.coords);
        } else {
          setError('The location accuracy is insufficient. Please move to an open area.');
        }
      },
      error => {
        setError(error.message);
      },
      { enableHighAccuracy: true, timeout: 50000, maximumAge: 10000 }
    );
  };

  const fetchIpAddress = async () => {
    try {
      console.log('Fetching IP address...');
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      console.log('IP address fetched:', data.ip);
      setIpAddress(data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
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
          const { uri, fileName } = response.assets[0];
          setUserImage({ uri, fileName });
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
        const { name: documentName, uri: documentUri } = result;
        setAttachmentDoc({ documentName, documentUri });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'Document selection was cancelled.');
      } else {
        Alert.alert('Error', 'Document selection failed.');
      }
    }
  };

  const handleSubmit = async () => {
    if (userDetails.emailID && !userDetails.emailID.endsWith('@gmail.com')) {
      Alert.alert('Error', 'Email must end with @gmail.com');
      return;
    }
    const formattedAttachmentDoc = attachmentDoc ? `${userDetails.username}_${userDetails.mobileno}_${attachmentDoc.documentName}` : null;
    const formattedUserImage = userImage ? `${userDetails.username}_${userDetails.mobileno}_${userImage.fileName}` : null;
 console.log('Formatted Attachment Doc:',userDetails.isAdmin );
    const data = {
      description,
      attachmentDoc: formattedAttachmentDoc,
      userImage: formattedUserImage,
      location: location ? `${location.latitude},${location.longitude}` : null,
      createdBy: userDetails.username,
      createdDate: new Date(),
      mobileno: userDetails.mobileno,
      emailID: userDetails.emailID,
      complaintStatus,
      ipAddress,
      isAdmin: userDetails.isAdmin // Add isAdmin field
    };

    try {
      await apiService.submitComplaint(data);
      Alert.alert('Success', 'Complaint submitted successfully');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert('Error', 'Failed to submit complaint');
    }
  };

  return (
    <ScrollView contentContainerStyle={AppStyles.scrollContainer}>
      <View style={AppStyles.container}>
        <Text style={AppStyles.title}>Submit Complaint</Text>
        <Text style={AppStyles.label}>Complaint Type</Text>
        <Picker
          selectedValue={complaintType}
          style={AppStyles.picker}
          onValueChange={(itemValue) => setComplaintType(itemValue)}
        >
          <Picker.Item label="Select Complaint Type" value="" />
          <Picker.Item label="Type 1" value="type1" />
          <Picker.Item label="Type 2" value="type2" />
          <Picker.Item label="Type 3" value="type3" />
        </Picker>
        <Text style={AppStyles.label}>Description</Text>
        <TextInput
          style={AppStyles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <Text style={AppStyles.label}>Mobile No</Text>
        <TextInput
          style={AppStyles.input}
          placeholder="Mobile No"
          value={userDetails.mobileno}
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
        <Button title="Refresh Location" onPress={fetchLocation} />
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
        {/* <Text style={AppStyles.label}>Complaint Status</Text>
        <TextInput
          style={AppStyles.input}
          value={complaintStatus}
          editable={false}
        /> */}
        <TouchableOpacity style={AppStyles.button} onPress={handleSubmit}>
          <Text style={AppStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ComplaintForm;