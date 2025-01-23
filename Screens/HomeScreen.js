import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../Contexts/AuthContext';
import AppStyles from '../AppStyles';

const HomeScreen = ({ navigation }) => {
  const { authToken, setAuthToken } = useContext(AuthContext);

  const handleLogout = () => {
    setAuthToken(null);
    navigation.navigate('Login');
  };

  const handleComplain = () => {
    navigation.navigate('Complain');
  };

  const handleComplainStatus = () => {
    navigation.navigate('ComplainStatus');
  };

  const handleComplainReply = () => {
    navigation.navigate('ComplainReply');
  };

  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.title}>Welcome </Text>
      <TouchableOpacity style={AppStyles.button} onPress={handleComplain}>
        <Text style={AppStyles.buttonText}>Complain</Text>
      </TouchableOpacity>
      <TouchableOpacity style={AppStyles.button} onPress={handleComplainStatus}>
        <Text style={AppStyles.buttonText}>Complain Status</Text>
      </TouchableOpacity>
      <TouchableOpacity style={AppStyles.button} onPress={handleComplainReply}>
        <Text style={AppStyles.buttonText}>Complain Reply</Text>
      </TouchableOpacity>
      <TouchableOpacity style={AppStyles.button} onPress={handleLogout}>
        <Text style={AppStyles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;