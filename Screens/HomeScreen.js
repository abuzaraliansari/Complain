import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../Contexts/AuthContext';
import AppStyles from '../AppStyles';

const HomeScreen = ({ navigation }) => {
  const { authToken, setAuthToken } = useContext(AuthContext);
  const { userDetails, setUserDetails } = useContext(AuthContext);

  useEffect(() => {
    if (userDetails) {
      console.log('userDetails.isAdmin:', userDetails.isAdmin);
    }
  }, [userDetails]);

  const handleLogout = () => {
    setAuthToken(null);
    navigation.replace('Login');
  };

  const handleComplain = () => {
    navigation.navigate('Complain');
  };

  const handleComplainStatus = () => {
    navigation.navigate('ComplaintDetails');
  };

  const handleComplainReply = () => {
    navigation.navigate('ComplaintReplyDetails');
  };

  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.title}>Welcome {userDetails.isAdmin ? 'Admin' : 'User'}  {userDetails.username}</Text>
      <TouchableOpacity style={AppStyles.button} onPress={handleComplain}>
        <Text style={AppStyles.buttonText}>Complain</Text>
      </TouchableOpacity>
      <TouchableOpacity style={AppStyles.button} onPress={handleComplainStatus}>
        <Text style={AppStyles.buttonText}>Complain Status</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={AppStyles.button} onPress={handleComplainReply}>
        <Text style={AppStyles.buttonText}>Complain Reply</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={AppStyles.button} onPress={handleLogout}>
        <Text style={AppStyles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;