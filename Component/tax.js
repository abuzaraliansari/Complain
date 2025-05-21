import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AppStyles from '../AppStyles';

const TaxCalculationPage = () => {
  const [pendingTax, setPendingTax] = useState('');
  const [discount, setDiscount] = useState('');
  const [lateFee, setLateFee] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const handleCalculateTotal = () => {
    const pendingTaxValue = parseFloat(pendingTax) || 0;
    const discountValue = parseFloat(discount) || 0;
    const lateFeeValue = parseFloat(lateFee) || 0;

    if (pendingTaxValue < 0 || discountValue < 0 || lateFeeValue < 0) {
      Alert.alert('Error', 'Values cannot be negative.');
      return;
    }

    const calculatedTotal = pendingTaxValue - discountValue + lateFeeValue;
    setTotalAmount(calculatedTotal.toFixed(2));
  };

  return (
    <ScrollView contentContainerStyle={AppStyles.scrollContainer}>
      <View style={AppStyles.container}>
        <Text style={AppStyles.title}>Tax Calculation</Text>

        {/* Pending Tax */}
        <Text style={AppStyles.label}>Pending Tax</Text>
        <TextInput
          style={AppStyles.input}
          placeholder="Enter Pending Tax"
          value={pendingTax}
          onChangeText={setPendingTax}
          keyboardType="numeric"
        />

        {/* Discount */}
        <Text style={AppStyles.label}>Discount</Text>
        <TextInput
          style={AppStyles.input}
          placeholder="Enter Discount"
          value={discount}
          onChangeText={setDiscount}
          keyboardType="numeric"
        />

        {/* Late Fee */}
        <Text style={AppStyles.label}>Late Fee</Text>
        <TextInput
          style={AppStyles.input}
          placeholder="Enter Late Fee"
          value={lateFee}
          onChangeText={setLateFee}
          keyboardType="numeric"
        />

        {/* Calculate Button */}
        <TouchableOpacity style={AppStyles.button} onPress={handleCalculateTotal}>
          <Text style={AppStyles.buttonText}>Calculate Total</Text>
        </TouchableOpacity>

        {/* Total Amount */}
        {totalAmount !== '' && (
          <View style={AppStyles.resultContainer}>
            <Text style={AppStyles.resultLabel}>Total Amount:</Text>
            <Text style={AppStyles.resultValue}>{totalAmount} ₹</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TaxCalculationPage;