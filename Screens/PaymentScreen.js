import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import AppStyles from '../AppStyles';
import axios from 'axios';
import { AuthContext } from '../Contexts/AuthContext';
const API_URL = process.env.API_URL || 'http://192.168.29.243:3000';

const PaymentScreen = ({ navigation }) => {
  // Get user details from AuthContext
  const { userDetails } = useContext(AuthContext);
  // Normalize user data to always have firstName, lastName, mobileNumber, etc.
  const userData = {
    ...userDetails,
    firstName: userDetails.firstName || userDetails.FirstName || '',
    lastName: userDetails.lastName || userDetails.LastName || '',
    mobileNumber: userDetails.mobileNumber || userDetails.MobileNo || '',
    houseNumber: userDetails.houseNumber || userDetails.HouseNumber || '',
    emailID: userDetails.emailID || userDetails.EmailID || '',
    zoneName: userDetails.zoneName || userDetails.ZoneName || '',
    localityName: userDetails.localityName || userDetails.LocalityName || '',
    colonyName: userDetails.colonyName || userDetails.ColonyName || '',
    username: userDetails.username || userDetails.Username || '',
    zoneID: userDetails.zoneID || userDetails.ZoneID || '',
  };
  const { username, firstName, lastName, mobileNumber, userID } = userData;

  const [taxLoading, setTaxLoading] = useState(false);
  const [taxAmount, setTaxAmount] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [taxSurveyData, setTaxSurveyData] = useState(null);
  const [taxError, setTaxError] = useState('');
  const [taxCalculated, setTaxCalculated] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'card' or 'upi'
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const handleCalculateTax = async () => {
    setTaxLoading(true);
    setTaxError('');
    try {
      const response = await axios.post(
        `https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getTaxSurveyByUserId`,
        { userId: userID },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Tax API response:', response.data); // Debug log
      if (response.data && response.data.success && Array.isArray(response.data.taxSurveyData) && response.data.taxSurveyData.length > 0) {
        setTaxSurveyData(response.data.taxSurveyData);
        const totalTax = response.data.taxSurveyData.reduce((sum, row) => sum + (row.TaxAmount || 0), 0);
        const pendingTax = response.data.taxSurveyData.reduce((sum, row) => sum + ((row.TaxAmount || 0) - (row.TaxPaidAmount || 0)), 0);
        const discount = response.data.taxSurveyData.reduce((sum, row) => sum + (row.Discount || 0), 0);
        const lateFee = response.data.taxSurveyData.reduce((sum, row) => sum + (row.LateTaxFee || row.LateFee || 0), 0);
        const total = pendingTax + lateFee - discount;
        setTaxAmount(pendingTax);
        setTotalAmount(total);
        setTaxCalculated(true);
        // Do not navigate yet, wait for Pay Tax button
      } else if (response.data && response.data.success && Array.isArray(response.data.taxSurveyData) && response.data.taxSurveyData.length === 0) {
        setTaxError('No tax data found for your account.');
      } else {
        setTaxError('No tax data found.');
      }
    } catch (error) {
      setTaxError('Failed to fetch tax details.');
    } finally {
      setTaxLoading(false);
    }
  };

  const handlePay = () => {
    setPaymentError('');
    if (paymentMethod === 'card') {
      if (!cardNumber || !cvv) {
        setPaymentError('Please enter card number and CVV');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        setPaymentError('Please enter UPI ID');
        return;
      }
    } else {
      setPaymentError('Please select a payment method');
      return;
    }
    // Move to next page with all data, including payment details
    const totalTax = taxSurveyData.reduce((sum, row) => sum + (row.TaxAmount || 0), 0);
    const pendingTax = taxSurveyData.reduce((sum, row) => sum + ((row.TaxAmount || 0) - (row.TaxPaidAmount || 0)), 0);
    const discount = taxSurveyData.reduce((sum, row) => sum + (row.Discount || 0), 0);
    const lateFee = taxSurveyData.reduce((sum, row) => sum + (row.LateTaxFee || row.LateFee || 0), 0);
    const total = pendingTax + lateFee - discount;
    navigation.navigate('TaxSummary', {
      userData,
      taxSurveyData,
      totalTax,
      pendingTax,
      discount,
      lateFee,
      totalAmount: total,
      paymentMethod,
      cardNumber: paymentMethod === 'card' ? cardNumber : undefined,
      cvv: paymentMethod === 'card' ? cvv : undefined,
      upiId: paymentMethod === 'upi' ? upiId : undefined,
    });
  };

  return (
    <ScrollView contentContainerStyle={AppStyles.scrollContainer}>
      <View style={AppStyles.container}>
        {/* User Info Section */}
        <View style={{ marginBottom: 20, alignItems: 'flex-start' }}>
          <Text style={AppStyles.label}>Username: <Text style={{ fontWeight: 'bold' }}>{username || '-'}</Text></Text>
          <Text style={AppStyles.label}>Full Name: <Text style={{ fontWeight: 'bold' }}>{firstName || ''} {lastName || ''}</Text></Text>
          <Text style={AppStyles.label}>Mobile No: <Text style={{ fontWeight: 'bold' }}>{mobileNumber || '-'}</Text></Text>
        </View>

        {/* Calculate/Pay Tax Button and Payment Method Selection */}
        {!taxCalculated ? (
          <TouchableOpacity style={AppStyles.button} onPress={handleCalculateTax} disabled={taxLoading}>
            <Text style={AppStyles.buttonText}>{taxLoading ? 'Calculating...' : 'Calculate Tax'}</Text>
          </TouchableOpacity>
        ) : (
          <>
            {/* Payment Method Selection */}
            <Text style={{ fontWeight: 'bold', marginTop: 16 }}>Select Payment Method:</Text>
            <View style={{ flexDirection: 'row', marginVertical: 8 }}>
              <TouchableOpacity
                style={[AppStyles.button, { backgroundColor: paymentMethod === 'card' ? '#4caf50' : '#2196f3', marginRight: 8 }]}
                onPress={() => setPaymentMethod('card')}
              >
                <Text style={AppStyles.buttonText}>Pay by Card</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[AppStyles.button, { backgroundColor: paymentMethod === 'upi' ? '#4caf50' : '#2196f3' }]}
                onPress={() => setPaymentMethod('upi')}
              >
                <Text style={AppStyles.buttonText}>Pay by UPI</Text>
              </TouchableOpacity>
            </View>
            {/* Payment Details Inputs */}
            {paymentMethod === 'card' && (
              <View style={{ marginBottom: 8 }}>
                <TextInput
                  style={AppStyles.loginInput}
                  placeholder="Card Number"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                  maxLength={16}
                />
                <TextInput
                  style={AppStyles.loginInput}
                  placeholder="CVV"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            )}
            {paymentMethod === 'upi' && (
              <View style={{ marginBottom: 8 }}>
                <TextInput
                  style={AppStyles.loginInput}
                  placeholder="UPI ID"
                  value={upiId}
                  onChangeText={setUpiId}
                  autoCapitalize="none"
                />
              </View>
            )}
            {paymentError ? <Text style={{ color: 'red', marginBottom: 8 }}>{paymentError}</Text> : null}
            <TouchableOpacity style={AppStyles.button} onPress={handlePay}>
              <Text style={AppStyles.buttonText}>Pay Now</Text>
            </TouchableOpacity>
          </>
        )}
        {taxError ? <Text style={{ color: 'red', marginVertical: 8 }}>{taxError}</Text> : null}
        {taxAmount !== null && (
          <View style={{marginVertical: 8}}>
            <Text style={{ fontWeight: 'bold' }}>Pending Tax Amount: ₹{taxAmount.toFixed(2)}</Text>
            {totalAmount !== null && (
              <Text style={{ fontWeight: 'bold' }}>Total Amount: ₹{totalAmount.toFixed(2)}</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PaymentScreen;