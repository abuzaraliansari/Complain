import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import AppStyles from '../AppStyles';

const PaymentScreen = ({ navigation }) => {
  const [showQRCode, setShowQRCode] = useState(false);

  const handleShowQRCode = () => {
    setShowQRCode(true);
  };

  return (
    <ScrollView contentContainerStyle={AppStyles.scrollContainer}>
      <View style={AppStyles.container}>
        <Text style={AppStyles.title}>Payment Options</Text>
        
        <Text style={AppStyles.label}>Pay through UPI ID</Text>
        <TextInput
          style={AppStyles.input}
          placeholder="Enter UPI ID"
        />
        <TouchableOpacity style={AppStyles.button}>
          <Text style={AppStyles.buttonText}>Pay</Text>
        </TouchableOpacity>

        <Text style={AppStyles.label}>Pay through Bank Transfer</Text>
        <TextInput
          style={AppStyles.input}
          placeholder="Enter Bank Account Number"
        />
        <TextInput
          style={AppStyles.input}
          placeholder="Enter IFSC Code"
        />
        <TouchableOpacity style={AppStyles.button}>
          <Text style={AppStyles.buttonText}>Pay</Text>
        </TouchableOpacity>

        <Text style={AppStyles.label}>Pay through QR Code</Text>
        <TouchableOpacity style={AppStyles.button} onPress={handleShowQRCode}>
          <Text style={AppStyles.buttonText}>Show QR Code</Text>
        </TouchableOpacity>
        {showQRCode && (
          <View style={AppStyles.qrCodeContainer}>
            <Image
              style={AppStyles.qrCode}
              source={require('./Qr.jpg')} // Updated path to the QR code image
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PaymentScreen;