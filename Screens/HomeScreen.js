import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../Contexts/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { authToken, setAuthToken } = useContext(AuthContext);

  const handleLogout = () => {
    setAuthToken(null);
    navigation.navigate('Login');
  };

  return (
    <View>
      <Text>Home Screen</Text>
      <Text>Token: {authToken}</Text>
      <Button title="Complain" onPress={handleLogout} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;