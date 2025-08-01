import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import AppStyles from '../AppStyles';
import axios from 'axios';
import { AuthContext } from '../Contexts/AuthContext';
const API_URL = process.env.API_URL || 'http://192.168.29.243:3000';

const PaymentScreen = ({ navigation }) => {
  const { userDetails } = useContext(AuthContext);
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
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cvv, setCvv] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [pin, setPin] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [showPinPrompt, setShowPinPrompt] = useState(false);

  const handleCalculateTax = async () => {
    setTaxLoading(true);
    setTaxError('');
    try {
      const response = await axios.post(
        `https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getTaxSurveyByUserId`,
        { userId: userID },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data && response.data.success && Array.isArray(response.data.taxSurveyData) && response.data.taxSurveyData.length > 0) {
        setTaxSurveyData(response.data.taxSurveyData);
        const pendingTax = response.data.taxSurveyData.reduce((sum, row) => sum + ((row.TaxAmount || 0) - (row.TaxPaidAmount || 0)), 0);
        const discount = response.data.taxSurveyData.reduce((sum, row) => sum + (row.Discount || 0), 0);
        const lateFee = response.data.taxSurveyData.reduce((sum, row) => sum + (row.LateTaxFee || row.LateFee || 0), 0);
        const total = pendingTax + lateFee - discount;
        setTaxAmount(pendingTax);
        setTotalAmount(total);
        setTaxCalculated(true);
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
      if (!cardNumber || !cvv || !cardholderName || !expirationDate) {
        setPaymentError('Please fill all card details');
        return;
      }
      if (!showPinPrompt) {
        setShowPinPrompt(true);
        return;
      }
      if (!pin) {
        setPaymentError('Please enter card PIN');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        setPaymentError('Please enter UPI ID');
        return;
      }
    } else if (paymentMethod === 'qr') {
      if (!showPinPrompt) {
        setShowPinPrompt(true);
        return;
      }
      if (!pin) {
        setPaymentError('Please enter UPI PIN');
        return;
      }
    } else {
      setPaymentError('Please select a payment method');
      return;
    }

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
      expirationDate: paymentMethod === 'card' ? expirationDate : undefined,
      cardholderName: paymentMethod === 'card' ? cardholderName : undefined,
      pin: paymentMethod === 'card' || paymentMethod === 'qr' ? pin : undefined,
      upiId: paymentMethod === 'upi' ? upiId : undefined,
    });
  };

  return (
    <ScrollView contentContainerStyle={AppStyles.scrollContainer}>
      <View style={AppStyles.container}>
        <View style={{ marginBottom: 20, alignItems: 'flex-start' }}>
          <Text style={AppStyles.label}>Username: <Text style={{ fontWeight: 'bold' }}>{username || '-'}</Text></Text>
          <Text style={AppStyles.label}>Full Name: <Text style={{ fontWeight: 'bold' }}>{firstName || ''} {lastName || ''}</Text></Text>
          <Text style={AppStyles.label}>Mobile No: <Text style={{ fontWeight: 'bold' }}>{mobileNumber || '-'}</Text></Text>
        </View>

        {!taxCalculated ? (
          <TouchableOpacity style={AppStyles.button} onPress={handleCalculateTax} disabled={taxLoading}>
            <Text style={AppStyles.buttonText}>{taxLoading ? 'Calculating...' : 'Calculate Tax'}</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={{ fontWeight: 'bold', marginTop: 16, fontSize: 18, color: '#333', alignSelf: 'center' }}>Select Payment Method:</Text>
            <View style={{ flexDirection: 'row', marginVertical: 12, justifyContent: 'center' }}>
              {['card', 'upi', 'qr'].map(method => (
                <TouchableOpacity
                  key={method}
                  style={[AppStyles.button, {
                    backgroundColor: paymentMethod === method ? '#4caf50' : '#fff',
                    borderColor: '#4caf50', borderWidth: 2,
                    marginRight: 8, minWidth: 100,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2, shadowRadius: 2, elevation: 2,
                  }]}
                  onPress={() => { setPaymentMethod(method); setShowPinPrompt(false); setPaymentError(''); }}>
                  <Text style={{ color: paymentMethod === method ? '#fff' : '#4caf50', fontWeight: 'bold', textAlign: 'center' }}>
                    Pay by {method.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {paymentMethod === 'card' && (
              <View style={{ borderWidth: 1, borderColor: paymentError ? 'red' : '#ccc', borderRadius: 8, padding: 12, marginBottom: 8, backgroundColor: '#fff' }}>
                <TextInput
                  style={{ fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 8, marginBottom: 4 }}
                  placeholder="Card Number"
                  keyboardType="numeric"
                  maxLength={19}
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(text.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                />
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={{ flex: 1, fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 8 }}
                    placeholder="MM / YY"
                    value={expirationDate}
                    onChangeText={setExpirationDate}
                    maxLength={5}
                  />
                  <TextInput
                    style={{ flex: 1, fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 8, marginLeft: 10 }}
                    placeholder="CVV"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
                <TextInput
                  style={{ fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 8, marginTop: 10 }}
                  placeholder="Enter name on card"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                />
                {showPinPrompt && (
                  <TextInput
                    style={{ fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 8, marginTop: 10 }}
                    placeholder="Enter PIN"
                    value={pin}
                    onChangeText={setPin}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={6}
                  />
                )}
              </View>
            )}

            {paymentMethod === 'upi' && (
              <View style={{
                backgroundColor: '#F8F8F8',
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: '#E0E0E0',
                marginBottom: 20,
              }}>
                <TextInput
                  style={{ fontSize: 16, color: '#000' }}
                  placeholder="example@okhdfcbank"
                  placeholderTextColor="#A0A0A0"
                  value={upiId}
                  onChangeText={setUpiId}
                  autoCapitalize="none"
                />
              </View>
            )}

            {paymentMethod === 'qr' && (
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8, color: '#333' }}>Scan QR to Pay</Text>
                <TouchableOpacity onPress={() => {
                  if (!showPinPrompt) {
                    setShowPinPrompt(true);
                  } else if (pin.length < 4) {
                    setPaymentError('Please enter a valid UPI PIN');
                  } else {
                    handlePay();
                  }
                }}>
                  <Image source={require('../Screens/Qr.jpg')} style={{ width: 180, height: 180, borderRadius: 12, borderWidth: 2, borderColor: '#4caf50', marginBottom: 8 }} />
                  <Text style={{ color: '#4caf50', fontWeight: 'bold', textAlign: 'center' }}>
                    {showPinPrompt ? 'Enter PIN & Tap to Pay' : 'Tap QR to Continue'}
                  </Text>
                </TouchableOpacity>
                {showPinPrompt && (
                  <TextInput
                    style={{
                      fontSize: 16,
                      backgroundColor: '#F0F0F0',
                      borderRadius: 10,
                      padding: 10,
                      width: 200,
                      marginTop: 10,
                      borderWidth: 1,
                      borderColor: '#CCC',
                    }}
                    placeholder="Enter UPI PIN"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    secureTextEntry
                    value={pin}
                    onChangeText={setPin}
                    maxLength={6}
                  />
                )}
              </View>
            )}

            {paymentError ? <Text style={{ color: 'red', marginBottom: 8 }}>⚠️ {paymentError}</Text> : null}

            <TouchableOpacity
              style={[AppStyles.button, { opacity: paymentMethod === 'qr' && showPinPrompt && pin.length < 4 ? 0.6 : 1 }]}
              onPress={() => {
                if (paymentMethod === 'qr' && (!showPinPrompt || pin.length < 4)) {
                  setShowPinPrompt(true);
                  setPaymentError('Please enter your UPI PIN');
                } else {
                  handlePay();
                }
              }}>
              <Text style={AppStyles.buttonText}>Pay Now</Text>
            </TouchableOpacity>
          </>
        )}

        {taxError ? <Text style={{ color: 'red', marginVertical: 8 }}>{taxError}</Text> : null}
        {taxAmount !== null && (
          <View style={{ marginVertical: 8 }}>
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
