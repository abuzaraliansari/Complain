import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../Contexts/AuthContext';
import AppStyles from '../AppStyles';

const HomeScreen = ({ navigation, route }) => {
  const { authToken, setAuthToken } = useContext(AuthContext);
  const { userDetails, setUserDetails } = useContext(AuthContext);

  useEffect(() => {
    if (route.params?.userDetails) {
      setUserDetails(route.params.userDetails);
    }
  }, [route.params?.userDetails]);

  useEffect(() => {
    if (userDetails) {
      console.log('userDetails.roles:', userDetails.roles);
    }
  }, [userDetails]);

  const handleLogout = () => {
    setAuthToken(null);
    navigation.replace('Login');
  };

  const handleComplain = () => {
    navigation.navigate('Location');
  };

  const handleComplainStatus = () => {
    navigation.navigate('ComplaintStatus');
  };

  const Complain = () => {
    navigation.navigate('Complain');
  };

  const handlePayment = () => {
    navigation.navigate('Payment');
  };

  const handleEditUser = () => {
    navigation.navigate('UserListScreen');
  };

  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.title}>Welcome {userDetails.firstName}</Text>
      {/* <Text style={AppStyles.title}>Mobile No. {userDetails.username}</Text> */}
      {!userDetails.roles.includes('Admin') && (
        <TouchableOpacity style={AppStyles.button} onPress={handleComplain}>
          <Text style={AppStyles.buttonText}>Complain</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={AppStyles.button} onPress={handleComplainStatus}>
        <Text style={AppStyles.buttonText}>Complain Status</Text>
      </TouchableOpacity>
      {!userDetails.roles.includes('Admin') && (
        <>
          <TouchableOpacity style={AppStyles.button} onPress={Complain}>
            <Text style={AppStyles.buttonText}>Complain With Out Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={AppStyles.button} onPress={handlePayment}>
            <Text style={AppStyles.buttonText}>Payment</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={AppStyles.button} onPress={handleLogout}>
        <Text style={AppStyles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;