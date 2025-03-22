import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from './Contexts/AuthContext';
import { FormDataProvider } from './Contexts/FormDataContext';
import { Text } from 'react-native'; // Import Text from react-native
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import HomeScreen from './Screens/HomeScreen';
import Location from './Screens/Location';
import FormScreen from './Screens/FormScreen';
import ComplaintForm from './Component/ComplaintForm';
import ComplaintDetails from './Component/ComplaintDetails';
import ComplaintDetailsPage from './Component/ComplaintDetailsPage';
import ComplaintReplyDetails from './Component/ComplaintReplyDetails';
import PaymentScreen from './Screens/PaymentScreen';
import UserListScreen from './Screens/UserListScreen';
import UserDetailsScreen from './Screens/UserDetailsScreen';

const Stack = createStackNavigator();

const AppContent = () => {
  const { userDetails } = useContext(AuthContext); // Access userDetails from AuthContext

  return (
    <FormDataProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Location" component={Location} />
          <Stack.Screen name="Form" component={FormScreen} />
          <Stack.Screen name="Complain" component={ComplaintForm} />
          <Stack.Screen
            name="ComplaintStatus"
            component={ComplaintDetails}
            options={{
              title: 'Complaint Search', // Title in the center
              headerRight: () => (
                userDetails?.username ? (
                  <Text style={{ marginRight: 10, fontSize: 16, color: '#000' }}>
                    {userDetails.username}
                  </Text>
                ) : null
              ), // Display username on the right side
            }}
          />
          <Stack.Screen name="ComplaintDetails" component={ComplaintDetailsPage} />
          <Stack.Screen name="ComplaintReply" component={ComplaintReplyDetails} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="UserListScreen" component={UserListScreen} />
          <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FormDataProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;