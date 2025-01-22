import React, { useContext } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { FormDataContext } from '../Contexts/FormDataContext';

const FormScreen = ({ navigation }) => {
  const { formData, setFormData } = useContext(FormDataContext);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <View>
      <Text>Form Screen</Text>
      <TextInput
        placeholder="Field 1"
        value={formData.field1 || ''}
        onChangeText={(value) => handleInputChange('field1', value)}
      />
      <TextInput
        placeholder="Field 2"
        value={formData.field2 || ''}
        onChangeText={(value) => handleInputChange('field2', value)}
      />
      <Button title="Submit" onPress={() => console.log(formData)} />
    </View>
  );
};

export default FormScreen;